import {useEffect, useRef, useState} from "react";
import {useNavigation} from "react-navi";
import {useMultipleApiCallbackRequest} from "../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import {toast} from "react-semantic-toasts";
import useCommonFormUtils from "../common/useCommonFormUtils";
import useLogger from "../../../core/logging/useLogger";
import createForm from "../../../core/form/createForm";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";

const useCreateForm = (formContent = null) => {
    const {t} = useTranslation();
    const {addToast} = useToasts();
    const sanitize = (form) => {
        try {
            return _.omit(form, ['_id', 'access', 'owner', 'created', 'modified', 'machineName'])
        } catch (e) {
            toast({
                type: 'warning',
                icon: 'exclamation circle',
                title: t('error.general'),
                description: t('form.create.failure.failed-to-create', {error: e.toString()}),
                animation: 'scale',
                time: 5000
            });
        }
    };

    const parseToObject = (formContent) => {
        try {
            return JSON.parse(formContent)
        } catch (e) {
            addToast(`${t('error.general')} - ${t('form.create.failure.invalid-json')}`,
                {
                    appearance: 'error',
                    autoDismiss: true,
                    pauseOnHover: true
                });
        }
    };

    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {handleForm} = useCommonFormUtils();
    const {log} = useLogger();


    const [form, setValues] = useState({
        data: formContent && formContent !== '' ? sanitize(parseToObject(formContent)) : {
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
                const formResponse = await axios({
                    method: 'GET',
                    url: `${envContext.url}/form?filter=name__eq__${form.data.name},path__eq__${form.data.path}&limit=1`
                });

                if (formResponse.data.total === 0) {
                    return await createForm(axios, envContext, form.data, log);
                }
                const formLoaded = formResponse.data.forms[0];
                return await axios({
                    "method": "PUT",
                    "url": `${envContext.url}/form/${formLoaded.id}`,
                    "data": form.data
                });
            } catch (error) {
                throw {
                    response: {
                        data: error
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
        addToast(`${form.data.name} has been successfully created`,
            {
                appearance: 'success',
                autoDismiss: true,
                pauseOnHover: true
            });
    };


    const failure = () => {
        let message = '';
        if (response) {
            if (response.data.validationErrors) {
                response.data.validationErrors.forEach((validationError) => {
                    message += validationError.message + "\n";
                });
            } else {
                message = response.data.exception;
            }
        } else {
            message = "No response from Form API server";
        }

        addToast(`${t('error.general')}: ${t('form.create.failure.failed-to-create', {error: message})}`,
            {
                appearance: 'error'
            });
    };

    const savedCallback = useRef();
    const failedCallbackRef = useRef();

    const callback = () => {
        success();
    };

    const failedCallback = () => {
        failure();
    }

    useEffect(() => {
        savedCallback.current = callback;
        failedCallbackRef.current = failedCallback;
    });

    useEffect(() => {
        if (status === SUCCESS) {
            savedCallback.current();
        }
        if (status === ERROR) {
            failedCallbackRef.current();
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
        handleForm(form.data);
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
        handleForm(form.data);
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
