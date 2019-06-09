import useApiRequest from "../../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {SUCCESS} from "../../../../core/api/actionTypes";
import useEnvContext from "../../../../core/context/useEnvContext";
import {Formio} from "react-formio";
import axios from "axios";

const usePreviewForm = (formId) => {

    const navigation = useNavigation();
    const {envContext} = useEnvContext();

    const [form, setValue] = useState({
        data: null,
        formId: formId,
        submission: null
    });

    const isMounted = useRef(true);
    const CancelToken = axios.CancelToken;
    const cancelPreview = useRef(CancelToken.source());

    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: { cancelToken: cancelPreview.current.token}
        }
    );

    const savedCallback = useRef();

    const callback = () => {
        Formio.Templates.framework="semantic";
        setValue(form => ({
            ...form,
            data: null
        }));
        makeRequest();
    };

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        savedCallback.current();
        const cancelPreviewRef = cancelPreview.current;
        return () => {
            cancelPreviewRef.cancel("Cancelling preview request");
            isMounted.current = false;
            Formio.Templates.framework="semantic";
        }
    }, [form.formId]);


    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                setValue(form => ({
                    ...form,
                    data: response.data
                }));
            }
        }
    }, [response, status, setValue]);

    const backToForms = async () => {
        await navigation.navigate(`/forms/${envContext.id}`, {replace: true});
    };

    const previewSubmission = (submission) => {
        setValue(form => ({
            ...form,
            submission: submission
        }));
    };

    const previewInGDS = async () => {
        await navigation.navigate(`/forms/${envContext.id}/${formId}/preview/gov-uk`, {replace: true});
    };

    return {
        previewSubmission,
        status,
        form,
        response,
        backToForms,
        previewInGDS
    }
};

export default usePreviewForm;
