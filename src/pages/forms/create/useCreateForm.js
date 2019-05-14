import {useEffect, useRef, useState} from "react";
import {useNavigation} from "react-navi";
import useApiRequest from "../../../core/api";
import {EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import {toast} from "react-semantic-toasts";

const useCreateForm = () => {
    const navigation = useNavigation();
    const {envContext} = useEnvContext();

    const [form, setValues] = useState({
        data: {
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

    const [{status, response}, makeRequest] = useApiRequest(
        `/form`, {
            verb: 'post', params: form.data
        }
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
                form.data.path = _.toLower(value).replace(/\s/g, '')
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
        const { missing} = form;
        const {path, title, name}= form.data;
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
