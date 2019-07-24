import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import {toast} from "react-semantic-toasts";
import {useTranslation} from "react-i18next";

const useGetVersions = (formId) => {
    const initialState = {
        limit: 10,
        activePage: 1,
        data: null,
        total: 0
    };
    const [version, setVersion] = useState(null);

    const isMounted = useRef(true);
    const [versions, setVersions] = useState(initialState);
    const {t} = useTranslation();
    const CancelToken = axios.CancelToken;

    const cancelVersionsRequest = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/${formId}/versions?limit=${versions.limit}${versions.activePage !== 1 ? `&offset=${((versions.activePage - 1) * versions.limit)}` : ''}`, {
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
        };
        restoreCallback.current = () => {
            if (restoreState.status === SUCCESS) {
                toast({
                    type: 'success',
                    icon: 'check circle',
                    title: t("form.restore.success-title"),
                    description: t("form.restore.success-description", {versionId: version}),
                    animation: 'scale',
                    time: 10000
                });
                makeRequest();
            }
            if (restoreState.status === ERROR) {
                toast({
                    type: 'error',
                    icon: 'exclamation circle',
                    title: t('error.general'),
                    description: t('form.restore.failure', {
                        error: restoreState.response ?
                            JSON.stringify(restoreState.response.data) : restoreState.exception.message
                    }),
                    animation: 'scale',
                    time: 10000
                })
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
                    data: response.data.versions,
                    total: response.data.total
                }));
            }

        }
    }, [response, status, setVersions]);

    const handlePaginationChange = (e, {activePage}) => {
        setVersions(versions => ({
            ...versions,
            activePage: activePage
        }));
    };

    const restore = (version) => {
        setVersion(version.versionId)
    };

    return {
        status,
        versions,
        response,
        handlePaginationChange,
        exception,
        restore,
        restoreState
    }
};

export default useGetVersions;
