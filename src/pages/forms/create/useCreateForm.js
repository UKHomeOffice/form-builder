import {useEffect, useRef, useState} from "react";
import {useNavigation} from "react-navi";
import {useMultipleApiCallbackRequest} from "../../../core/api";
import {EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import {toast} from "react-semantic-toasts";
import useCommonFormUtils from "../common/useCommonFormUtils";
import useLogger from "../../../core/logging/useLogger";
import createForm from "../../../core/form/createForm";

const useCreateForm = (formContent = null) => {

    const sanitize = (form) => {
        return _.omit(form, ['_id', 'access', 'owner', 'created', 'modified', 'machineName'])
    };

    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {submissionAccess, handleForm} = useCommonFormUtils();
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
            try {
                return await createForm(axios, envContext, form.data, submissionAccess, log);
            } catch (error) {
                throw {
                    response: {
                        data: error.toString()
                    }
                }
            }
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
                form.data.machineName = form.data.name;

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

    const changeDisplay = (value) => {
        form.data.display = value;
        if (value === 'form') {
            handleForm(form.data);
        }
        setValues({
            ...form
        });
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
        closePreview,
        changeDisplay
    }
};

export default useCreateForm;
