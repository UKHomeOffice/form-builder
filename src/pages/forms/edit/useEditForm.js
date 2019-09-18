import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import useApiRequest from "../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";
import _ from 'lodash';
import axios from "axios";
import useCommonFormUtils from "../common/useCommonFormUtils";
import formindexdb from '../../../core/db/formindexdb';
import eventEmitter from "../../../core/eventEmitter";
import uuid4 from "uuid4";
import {useToasts} from "react-toast-notifications";

const useEditForm = (formId) => {

    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {handleForm} = useCommonFormUtils();
    const {addToast} = useToasts();
    const [editForm, setValues] = useState({
        data: {},
        openLocalChangesDetectedModal: false,
        reloadingFromLocal: false,
        formId: formId,
        displayPreview: false,
        hasUnsavedData: false,
        missing: {
            path: false,
            title: false,
            name: false
        }
    });

    const isMounted = useRef(true);
    const CancelToken = axios.CancelToken;
    const cancelEdit = useRef(CancelToken.source());


    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {
                cancelToken: cancelEdit.current.token
            }
        }
    );
    const [state, editRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'put', params: editForm.data
        }
    );

    const savedCallback = useRef();

    const editSuccessCallback = useRef();

    const editFailedCallback = useRef();

    const loadingFormFailedCallback = useRef();

    const onSuccessfulEdit = async () => {
        addToast(`${editForm.data.name} has been successfully updated`, { id:  uuid4(), appearance: 'success', autoDismiss: true});

        formindexdb.form.clear().then(() => {
            console.log("Draft data cleared from edit page");
        });

        await navigation.navigate(`/forms/${envContext.id}/${editForm.data.id}/preview`, {replace: true});
    };

    const callback = () => {
        setValues(form => ({
            ...form,
            data: {}
        }));
        makeRequest();
    };

    useEffect(() => {
        savedCallback.current = callback;
        editSuccessCallback.current = onSuccessfulEdit;
        loadingFormFailedCallback.current = () => {
            eventEmitter.publish('error', {
                response: response,
                exception: exception
            });
        }
        editFailedCallback.current = () => {
            eventEmitter.publish('error', {
                id: uuid4(),
                response: state.response,
                exception: state.exception
            });
        }
    });

    useEffect(() => {
        savedCallback.current();
        const cancelEditRef = cancelEdit.current;

        return () => {
            formindexdb.form.clear().then(() => {
                console.log("Draft data cleared");
            });
            cancelEditRef.cancel("Cancelling edit request");
            isMounted.current = false;
        }
    }, [editForm.formId]);


    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                formindexdb.form.get(formId).then(dataFromLocal => {
                    if (dataFromLocal) {
                        setValues(editForm => ({
                            ...editForm,
                            openLocalChangesDetectedModal: true
                        }));
                    }
                }, error => {
                    console.log(error);
                });

                setValues(editForm => ({
                    ...editForm,
                    data: response.data,
                }));
            }
        }
        if (status === ERROR) {
            loadingFormFailedCallback.current();
        }
    }, [response, status, setValues, formId]);

    useEffect(() => {
        const onSuccessEdit = async () => {
            await editSuccessCallback.current();
        };
        if (state.status === SUCCESS) {
            onSuccessEdit();
            return;
        }
        if (state.status === ERROR) {
            editFailedCallback.current();
        }
    }, [state]);

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
        softSave();
    };

    const updateForm = (form) => {
        editForm.data.components = form.components;
        setValues({
            ...editForm
        });
        softSave();
    };

    const softSave = () => {
        setValues({
            ...editForm,
            hasUnsavedData: true
        });
        formindexdb.form.put({
            path: navigation.getCurrentValue().url.pathname,
            id: formId,
            schema: editForm.data
        }).then((id) => {
            console.log(`saved ${id}`);
        }).catch((err) => {
            console.error(err);
        });
    };

    const backToForms = async () => {
        await navigation.navigate(`/forms/${envContext.id}`);
    };

    const openPreview = () => {
        handleForm(editForm.data);
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
        handleForm(editForm.data);
        setValues({
            ...editForm
        });
        softSave();
    };

    const closeDraftModal = () => {
        setValues({
            ...editForm,
            openLocalChangesDetectedModal: false
        });
    };

    const loadLocalChanges = () => {
        setValues(editForm => ({
            ...editForm,
            reloadingFromLocal: true
        }));
        formindexdb.form.get(formId).then(dataFromLocal => {
            setValues(editForm => ({
                ...editForm,
                reloadingFromLocal: false,
                data: {
                    name: dataFromLocal.schema.name,
                    title: dataFromLocal.schema.title,
                    path: dataFromLocal.schema.path,
                    components: dataFromLocal.schema.components,
                    display: dataFromLocal.schema.display
                },
                openLocalChangesDetectedModal: false,
            }));
        }, error => {
            console.log(error);
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
        editRequest,
        state,
        changeDisplay,
        closeDraftModal,
        loadLocalChanges
    }
};

export default useEditForm;
