import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import useApiRequest from "../../../core/api";
import {EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";
import {toast} from "react-semantic-toasts";
import _ from 'lodash';
import axios from "axios";

const useEditForm = (formId) => {

    const navigation = useNavigation();
    const {envContext} = useEnvContext();

    const [editForm, setValues] = useState({
        data: null,
        original: null,
        formId: formId,
        displayPreview: false,
        missing: {
            path: false,
            title: false,
            name: false
        }
    });

    const isMounted = useRef(true);
    const CancelToken = axios.CancelToken;
    const cancelEdit = useRef(CancelToken.source());


    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {
                cancelToken: cancelEdit.current.token
            }
        }
    );
    const [state, saveRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'put', params: editForm.data
        }
    );

    const savedCallback = useRef();

    const editSuccessCallback = useRef();

    const onSuccessfulEdit = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
        toast({
            type: 'success',
            icon: 'check circle',
            title: `${editForm.data.title} updated`,
            description: `${editForm.data.name} has been successfully updated`,
            animation: 'scale',
            time: 10000
        });
    };

    const callback = () => {
        setValues(form => ({
            ...form,
            data: null
        }));
        makeRequest();
    };

    useEffect(() => {
        savedCallback.current = callback;
        editSuccessCallback.current = onSuccessfulEdit;
    });

    useEffect(() => {
        savedCallback.current();
        const cancelEditRef = cancelEdit.current;

        return () => {
            cancelEditRef.cancel("Cancelling edit request");
            isMounted.current = false;
        }
    }, [editForm.formId]);


    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                setValues(editForm => ({
                    ...editForm,
                    data: response.data,
                    original: response.data
                }));
            }
        }
    }, [response, status, setValues]);

    useEffect(() => {
        if (state.status === SUCCESS) {
            editSuccessCallback.current();
        }
    }, [state, navigation]);

    const updateField = (target, value) => {
        const hasValue = value && value !== '';
        if (target === 'title') {
            if (hasValue) {
                editForm.missing['title'] = false;
                editForm.missing["path"] = false;
                editForm.missing["name"] = false;

                editForm.data.title = value;
                editForm.data.path = _.toLower(value).replace(/\s/g, '');
                editForm.data.name = _.camelCase(value);
                editForm.data.machineName = editForm.data.name;

                setValues({
                    ...editForm
                });
            } else {
                editForm.missing['title'] = true;
                editForm.data.title = '';
                setValues({
                    ...editForm
                });
            }

        } else {
            editForm.missing[target] = !hasValue;
            editForm.data[target] = value;
            setValues({
                ...editForm
            });
        }
    };

    const updateForm = (form) => {
        editForm.data.components = _.cloneDeep(form.components);
        setValues({
            ...editForm
        });
    };

    const backToForms = async () => {
        await navigation.navigate(`/forms/${envContext.id}`);
    };

    const openPreview = () => {
        setValues({
            ...editForm,
            displayPreview: true
        });
    };

    const closePreview = () => {
        setValues({
            ...editForm,
            displayPreview: false
        });
    };

    const formInvalid = () => {
        const {missing} = editForm;
        const {path, title, name} = editForm.data;
        return (path === '' || title === '' || name === '')
            || (missing.path || missing.title || missing.name)
            || state.status === EXECUTING;
    };
    const changeDisplay = (value) => {
        editForm.data.display = value;
        setValues({
            ...editForm
        });
    };


    return {
        status,
        editForm,
        response,
        updateField,
        updateForm,
        backToForms,
        closePreview,
        openPreview,
        formInvalid,
        saveRequest,
        state,
        changeDisplay
    }
};

export default useEditForm;
