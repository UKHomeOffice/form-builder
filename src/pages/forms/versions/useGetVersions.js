import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {SUCCESS} from "../../../core/api/actionTypes";

const useGetVersions = (formId) => {
    const initialState = {
        limit: 10,
        activePage: 1,
        data: null,
        total: 0,
    };
    const isMounted = useRef(true);
    const [versions, setVersions] = useState(initialState);

    const CancelToken = axios.CancelToken;

    const cancelVersionsRequest = useRef(CancelToken.source());

    const [{status, response}, makeRequest] = useApiRequest(
        `/forms/${formId}/versions?limit=${versions.limit}${versions.activePage !== 1 ? `&offset=${((versions.activePage - 1) * versions.limit)}` : ''}`, {
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

    const handlePaginationChange = (e, {activePage}) => {
        setVersions(versions => ({
            ...versions,
            activePage: activePage
        }));
    };


    return {
        status,
        versions,
        response,
        handlePaginationChange
    }
};

export default useGetVersions;
