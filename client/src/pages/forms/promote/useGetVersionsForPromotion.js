import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import eventEmitter from "../../../core/eventEmitter";
import uuid4 from "uuid4";
import {useToasts} from "react-toast-notifications";

const useGetVersionsForPromotion = (formId) => {

    const initialState = {
        limit: 10,
        activePage: 0,
        data: [],
        total: 0,
        versionKey: null
    };
    const isMounted = useRef(true);
    const [versions, setVersions] = useState(initialState);
    const CancelToken = axios.CancelToken;
    const cancelVersionsRequest = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/${formId}/versions?limit=${versions.limit}&offset=${((versions.activePage ) * versions.limit)}&select=createdBy&select=validTo&select=latest&select=versionId&select=validFrom&select=updatedBy`, {
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



    return {
        status,
        versions,
        response,
        handlePaginationChange,
        exception,
    }
};

export default useGetVersionsForPromotion;
