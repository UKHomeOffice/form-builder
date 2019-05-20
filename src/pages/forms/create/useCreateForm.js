import {useEffect, useRef, useState} from "react";
import {useNavigation} from "react-navi";
import {useMultipleApiCallbackRequest} from "../../../core/api";
import {EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import {toast} from "react-semantic-toasts";
import useCommonFormUtils from "../common/useCommonFormUtils";
import useLogger from "../../../core/logging/useLogger";

const useCreateForm = (formContent = null) => {

    const sanitize = (form) => {
        return _.omit(form, ['_id', 'access', 'owner', 'created', 'modified', 'machineName'])
    };

    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {submissionAccess} = useCommonFormUtils();
    const {log} = useLogger();

    const [form, setValues] = useState({
        data: formContent && formContent !== '' ? sanitize(JSON.parse(formContent)) : {
            title: '',
            path: '',
            display: 'form',
            name: ''
        },
        displayPreview: false,
        missing: {
            path: false,
            title: false,
            name: false
        }
    });

    const formName = form.data.name;
    const [{status, response}, makeRequest] = useMultipleApiCallbackRequest(async (axios) => {
            const anonymous = await axios({
                method: 'GET',
                url: `${envContext.url}/role?machineName=anonymous`,
            });
            form.data['submissionAccess'] = submissionAccess(anonymous.data[0]._id);

            const response = await axios({
                url: `${envContext.url}/form`,
                method: 'POST',
                data: form.data
            });

            const formId = response.data._id;
            const actions = await axios({
                url: `${envContext.url}/form/${formId}/action`,
                method: 'GET'
            });

            const deleteAction =(action) => {
                return axios({
                    url: `${envContext.url}/form/${response.data._id}/action/${action._id}`,
                    method: 'DELETE'
                });
            };

            if (actions.data.length >= 1) {
                await Promise.all(actions.data.map((action) => deleteAction(action)));
                log([{
                    message: `Deleted actions for ${formId}`,
                    level: 'info'
                }]);
            }
            return response;
        }, [{
            message: `Creating form ${formName}`,
            level: 'info'
        }], [{
            message: `form ${formName} successfully created`,
            level: 'info',
        }]
    );
    const success = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
        toast({
            type: 'success',
            icon: 'check circle',
            title: `${form.data.title} created`,
            description: `${form.data.name} has been successfully created`,
            animation: 'scale',
            time: 10000
        });
    };

    const savedCallback = useRef();

    const callback = () => {
        success();
    };

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        if (status === SUCCESS) {
            savedCallback.current();
        }
    }, [status]);

    const backToForms = () => {
        navigation.navigate(`/forms/${envContext.id}`);
    };

    const updateField = (target, value) => {
        const hasValue = value && value !== '';
        if (target === 'title') {
            if (hasValue) {
                form.missing['title'] = false;
                form.missing["path"] = false;
                form.missing["formName"] = false;

                form.data.title = value;
                form.data.path = _.toLower(value).replace(/\s/g, '');
                form.data.name = _.camelCase(value);

                setValues({
                    ...form
                });
            } else {
                form.missing['title'] = true;
                form.data.title = '';
                setValues({
                    ...form
                });
            }

        } else {
            form.missing[target] = !hasValue;
            form.data[target] = value;
            setValues({
                ...form
            });
        }
    };

    const openPreview = () => {
        setValues({
            ...form,
            displayPreview: true
        });
    };

    const closePreview = () => {
        setValues({
            ...form,
            displayPreview: false
        });
    };

    const formInvalid = () => {
        const {missing} = form;
        const {path, title, name} = form.data;
        return (path === '' || title === '' || name === '')
            || (missing.path || missing.title || missing.name) || status === EXECUTING;
    };

    return {
        formInvalid,
        backToForms,
        makeRequest,
        status,
        response,
        setValues,
        form,
        updateField,
        openPreview,
        closePreview
    }
};

export default useCreateForm;
