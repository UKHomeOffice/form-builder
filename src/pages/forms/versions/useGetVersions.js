import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";

const useGetVersions = (formId) => {
    const initialState = {
        limit: 10,
        activePage: 0,
        data: null,
        total: 0,
        versionKey: null
    };
    const [version, setVersion] = useState(null);

    const isMounted = useRef(true);
    const [versions, setVersions] = useState(initialState);
    const {t} = useTranslation();
    const CancelToken = axios.CancelToken;
    const {addToast} = useToasts();
    const cancelVersionsRequest = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/${formId}/versions?limit=${versions.limit}&offset=${((versions.activePage ) * versions.limit)}&select=validTo&select=latest&select=versionId&select=validFrom`, {
            verb: 'get', params: {
                cancelToken: cancelVersionsRequest.current.token
            }
        }
    );

    const [restoreState, makeRestoreRequest] = useApiRequest(`/form/restore`, {
        verb: 'post', params: {
            formId: formId,
            versionId: version
        }
    });

    const savedCallback = useRef();
    const cancelRequests = useRef();
    const restoreCallback = useRef();
    const executeRestoreCallback = useRef();

    useEffect(() => {
        savedCallback.current = () => {
            makeRequest();
        };
        cancelRequests.current = () => {
            cancelVersionsRequest.current.cancel('Cancelling get versions');
            isMounted.current = false;
        };
        restoreCallback.current = () => {
            if (restoreState.status === SUCCESS) {
                addToast(`${t("form.restore.success-title")} - ${t("form.restore.success-description", {versionId: version})}`,
                    {
                        appearance: 'success',
                        autoDismiss: true,
                        pauseOnHover: true
                    });
                makeRequest();
            }
            if (restoreState.status === ERROR) {
                let message = '';
                if (restoreState.response) {
                    if (restoreState.response.data.validationErrors) {
                        restoreState.response.data.validationErrors.forEach((validationError) => {
                            message += validationError.message + "\n";
                        });
                    } else {
                        message = restoreState.response.data.exception;
                    }
                } else {
                    message = "No response from Form API server";
                }

                addToast(`${t('form.restore.failure', {
                        error: message
                    })}`,
                    {
                        appearance: 'error'
                    });

            }
        };
        executeRestoreCallback.current = () => {
            makeRestoreRequest();
        }
    });

    useEffect(() => {
        if (version) {
            executeRestoreCallback.current();
        }
    }, [version]);

    useEffect(() => {
        restoreCallback.current();
    }, [restoreState]);

    useEffect(() => {
        savedCallback.current();
    }, [versions.activePage]);

    useEffect(() => {
        return () => {
            cancelRequests.current();
        }
    }, [formId]);

    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                setVersions(versions => ({
                    ...versions,
                    versionKey: response.data.versions ? response.data.versions[0].versionId : null,
                    data: response.data.versions,
                    total: response.data.total
                }));
            }

        }
    }, [response, status, setVersions]);

    const handlePaginationChange = (activePage) => {
        setVersions(versions => ({
            ...versions,
            activePage: activePage
        }));
    };

    const restore = (versionId) => {
        setVersion(versionId)
    };

    const setVersionKey = (versionKey) => {
        setVersions(versions => ({
            ...versions,
             versionKey: versionKey
        }));
    };


    return {
        status,
        versions,
        response,
        handlePaginationChange,
        exception,
        restore,
        restoreState,
        setVersionKey
    }
};

export default useGetVersions;
