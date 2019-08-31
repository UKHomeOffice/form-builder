import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import eventEmitter from '../../../core/eventEmitter';
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import uuid4 from "uuid4";

const useGetVersion = (versionId) => {
    const [version, setVersion] = useState({
       data: null,
       openDetails: false
    });

    const isMounted = useRef(true);
    const CancelToken = axios.CancelToken;
    const cancelGetVersion = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/version/${versionId}`, {
            verb: 'get', params: {cancelToken: cancelGetVersion.current.token}
        }
    );

    const handleGetVersion = useRef();
    const handleSuccessfulGetVersion = useRef();
    const handleFailedGetVersion = useRef();


    const versionRequestCallback = () => {
        makeRequest();
    };
    const successfulGetVersion = () => {
      const data = response.data;
      setVersion(version => ({
          ...version,
          data: data
      }));
    };

    const failedGetVersion = () => {
        eventEmitter.publish('error', {
            exception: exception,
            response: response,
            id: uuid4()
        });
    };

    useEffect(() => {
        handleGetVersion.current = versionRequestCallback;
        handleSuccessfulGetVersion.current = successfulGetVersion;
        handleFailedGetVersion.current = failedGetVersion;
    });

    useEffect(() => {
        handleGetVersion.current();
        const cancelPreviewRef = cancelGetVersion.current;
        return () => {
            cancelPreviewRef.cancel("Cancelling get version request");
            isMounted.current = false;
        }
    }, [versionId]);

    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                handleSuccessfulGetVersion.current();
            }
        }
        if (status === ERROR) {
            if (isMounted.current) {
                handleFailedGetVersion.current();
            }
        }
    }, [status]);

    return {
        status,
        version,
        setVersion
    }


};

export default useGetVersion;
