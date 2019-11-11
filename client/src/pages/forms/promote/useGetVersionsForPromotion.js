import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {SUCCESS} from "../../../core/api/actionTypes";


const useGetVersionsForPromotion = (formId) => {

    const initialState = {
        limit: 10,
        activePage: 0,
        data: [],
        total: 0,
        versionsToCompare: {
            first: null,
            second: null
        },
        showCompareModal: false,
        versionToView: null
    };
    const isMounted = useRef(true);
    const [versions, setVersions] = useState(initialState);
    const CancelToken = axios.CancelToken;
    const cancelVersionsRequest = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/${formId}/versions?limit=${versions.limit}&offset=${((versions.activePage ) * versions.limit)}`, {
            verb: 'get', params: {
                cancelToken: cancelVersionsRequest.current.token
            }
        }
    );

    const savedCallback = useRef();
    const cancelRequests = useRef();

    useEffect(() => {
        savedCallback.current = () => {
            makeRequest();
        };
        cancelRequests.current = () => {
            cancelVersionsRequest.current.cancel('Cancelling get versions');
            isMounted.current = false;
        };
    });

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

    const handleVersionPagination = (activePage) => {
        setVersions(versions => ({
            ...versions,
            activePage: activePage
        }));
    };

    const compare = (e, version) => {
        const checked = e.target.checked;

        if (checked) {
            if (versions.versionsToCompare.first === null) {
                versions.versionsToCompare.first = version;
            } else {
                versions.versionsToCompare.second = version;
            }
        } else {
            if (versions.versionsToCompare.first !== null
                && versions.versionsToCompare.first.versionId === version.versionId) {
                versions.versionsToCompare.first = null;
            }
            if (versions.versionsToCompare.second !== null
                && versions.versionsToCompare.second.versionId === version.versionId) {
                versions.versionsToCompare.second = null;
            }
        }
        const showModal = versions.versionsToCompare.first !== null && versions.versionsToCompare.second !== null;

        setVersions(versions => ({
            ...versions,
            showCompareModal: showModal
        }));
    };

    const showVersion = (version) => {
        setVersions(versions => ({
            ...versions,
            versionToView: version
        }));
    };

    const hideVersion = () => {
        setVersions(versions => ({
            ...versions,
            versionToView: null
        }));
    };
    const hideCompare = () => {
        setVersions(versions => ({
            ...versions,
            showCompareModal: false
        }));
    };

    return {
        status,
        versions,
        response,
        handleVersionPagination,
        exception,
        compare,
        hideCompare,
        showVersion,
        hideVersion
    }
};

export default useGetVersionsForPromotion;
