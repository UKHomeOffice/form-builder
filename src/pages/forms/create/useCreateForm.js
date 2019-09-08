import {useEffect, useRef, useState} from "react";
import {useNavigation} from "react-navi";
import {useMultipleApiCallbackRequest} from "../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import useCommonFormUtils from "../common/useCommonFormUtils";
import useLogger from "../../../core/logging/useLogger";
import createForm from "../../../core/form/createForm";
import {useTranslation} from "react-i18next";
import formindexdb from '../../../core/db/formindexdb';
import eventEmitter from "../../../core/eventEmitter";
import uuid4 from "uuid4";
import {toast} from "react-toastify";
import axios from "axios";

const useCreateForm = (formContent = null) => {
    const {t} = useTranslation();
    const sanitize = (form) => {
        try {
            return _.omit(form, ['_id', 'access', 'owner', 'created', 'modified', 'machineName'])
        } catch (e) {
            eventEmitter.publish('error', {
                id: uuid4(),
                message: `${t('error.general')} - ${t('form.create.failure.failed-to-create', {error: e.toString()})}`
            });
        }
    };

    const parseToObject = (formContent) => {
        try {
            return JSON.parse(formContent)
        } catch (e) {

            eventEmitter.publish('error', {
                id: uuid4(),
                message: `${t('error.general')} - ${t('form.create.failure.invalid-json')}`
            });
        }
    };

    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {handleForm} = useCommonFormUtils();
    const {log} = useLogger();
    const isMounted = useRef(true);

    const [form, setValues] = useState({
        data: formContent && formContent !== '' ? sanitize(parseToObject(formContent)) : {
            title: '',
            path: '',
            display: 'form',
            name: '',
            components: []
        },
        openLocalChangesDetectedModal: false,
        reloadingFromLocal: false,
        localData: null,
        displayPreview: false,
        missing: {
            path: false,
            title: false,
            name: false
        }
    });

    const formName = form.data.name;
    const CancelGetToken = axios.CancelToken;
    const cancelGet = useRef(CancelGetToken.source());
    const CancelCreateToken = axios.CancelToken;
    const cancelCreate = useRef(CancelCreateToken.source());

    const softSaveRef = useRef();

    const [{status, exception, response}, makeRequest] = useMultipleApiCallbackRequest(async (axios) => {

            try {
                const formResponse = await axios({
                    method: 'GET',
                    url: `${envContext.url}/form?filter=name__eq__${form.data.name},path__eq__${form.data.path}&limit=1`,
                    cancelToken: cancelGet.current.token
                });

                if (formResponse.data.total === 0) {
                    return await createForm(axios, envContext, form.data, log);
                }
                const formLoaded = formResponse.data.forms[0];
                return await axios({
                    "method": "PUT",
                    "url": `${envContext.url}/form/${formLoaded.id}`,
                    "data": form.data,
                    cancelToken: cancelCreate.current.token
                });
            } catch (error) {
                throw Object.assign(new Error(error.message), {
                    response: {
                        data: error
                    }
                });
            }
        }, [{
            message: `Creating form ${formName}`,
            level: 'info'
        }], [{
            message: `form ${formName} successfully created`,
            level: 'info',
        }]
    );
    const success = async () => {
        toast.success(`${form.data.name} has been successfully created`)

        formindexdb.form.clear().then(() => {
            console.log("Draft data cleared");
        });
        await navigation.navigate(`/forms/${envContext.id}`, {replace: true});
    };


    const failure = () => {
        eventEmitter.publish('error', {
            id: uuid4(),
            exception: exception,
            response: response,
            translateKey: 'form.create.failure.failed-to-create'
        });
    };

    const savedCallback = useRef();
    const failedCallbackRef = useRef();

    const callback = () => {
        success();
    };

    const failedCallback = () => {
        failure();
    };



    useEffect(() => {
        console.log("checking for any existing data");
        const cancelGetRef = cancelCreate.current;
        const cancelCreateRef = cancelGet.current;


        formindexdb.form.where("path").equals(navigation.getCurrentValue().url.pathname).count().then((data) => {
            if (data !== 0) {
                setValues({
                    ...form,
                    openLocalChangesDetectedModal: true
                });
            }
        });
        setInterval(() => {
            softSaveRef.current();
        }, 30000);
        return () => {
            formindexdb.form.clear().then(() => {
                console.log("Draft data cleared");
            });
            isMounted.current = false;
            cancelGetRef.cancel("Cancelling get request");
            cancelCreateRef.cancel("Cancelling create request");

        };
    }, []);

    useEffect(() => {
        softSaveRef.current = () => {
            softSave();
        };
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
        if (isMounted.current) {
            const hasValue = value && value !== '';
            if (target === 'title') {
                if (hasValue) {
                    form.missing['title'] = false;
                    form.missing["path"] = false;
                    form.missing["formName"] = false;

                    form.data.title = value;
                    form.data.path = _.toLower(value).replace(/\s/g, '');

                    if (form.data.components && form.data.components.length !== 0) {
                        formindexdb.form.delete(form.data.name).then(() => {
                            console.log("deleted old record");
                        });
                    }
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
            softSave();
        }

    };

    const openPreview = () => {
        if (isMounted.current) {
            handleForm(form.data);
            setValues({
                ...form,
                displayPreview: true
            });
        }

    };

    const closePreview = () => {
        if (isMounted.current) {
            setValues({
                ...form,
                displayPreview: false
            });
        }

    };

    const formInvalid = () => {
        const {missing} = form;
        const {path, title, name} = form.data;
        return (path === '' || title === '' || name === '')
            || (missing.path || missing.title || missing.name) || status === EXECUTING;
    };

    const changeDisplay = (value) => {
        if (isMounted.current) {
            form.data.display = value;
            handleForm(form.data);
            setValues({
                ...form
            });
            softSave();
        }

    };


    const softSave = () => {
        if (form.data.components
            && form.data.components.length !== 0
        ) {
            setValues({
                ...form,
                hasUnsavedData: true
            });
            formindexdb.form.put({
                path: navigation.getCurrentValue().url.pathname,
                id: form.data.name,
                schema: form.data
            }).then((id) => {
                console.log(`saved ${id}`);
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const updateSchema = (jsonSchema) => {
        if (isMounted.current) {
            form.data.components = jsonSchema.components;
            setValues({
                ...form
            });
            softSave();
        }

    };


    const loadLocalChanges = () => {
        if (isMounted.current) {
            setValues(form => ({
                ...form,
                reloadingFromLocal: true
            }));
            formindexdb.form.where("path").equals(navigation.getCurrentValue().url.pathname).first().then(dataFromLocal => {
                setValues(form => ({
                    ...form,
                    reloadingFromLocal: false,
                    data: dataFromLocal.schema,
                    openLocalChangesDetectedModal: false,
                }));
            }, error => {
                console.log(error);
            });
        }


    };
    const closeDraftModal = () => {
        if (isMounted.current) {
            setValues({
                ...form,
                openLocalChangesDetectedModal: false
            });
        }

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
        changeDisplay,
        updateSchema,
        loadLocalChanges,
        closeDraftModal
    }
};

export default useCreateForm;
