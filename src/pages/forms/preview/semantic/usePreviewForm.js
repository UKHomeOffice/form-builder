import useApiRequest from "../../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {SUCCESS} from "../../../../core/api/actionTypes";
import useEnvContext from "../../../../core/context/useEnvContext";
import {Formio} from "react-formio";
import govukFormioTemplate from "../govUK/govuk-formio-template";

const usePreviewForm = (formId) => {

    const navigation = useNavigation();
    const {envContext} = useEnvContext();

    const [form, setValue] = useState({
        data: null,
        formId: formId,
        submission: null
    });
    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {}
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
        return () => {
            Formio.Templates.framework="semantic";
        }
    }, [form.formId]);


    useEffect(() => {
        if (status === SUCCESS) {
            setValue(form => ({
                ...form,
                data: response.data
            }));
        }
    }, [response, status, setValue]);

    const backToForms = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
    };

    const previewSubmission = (submission) => {
        setValue(form => ({
            ...form,
            submission: submission
        }));
    };

    const previewInGDS = () => {
        navigation.navigate(`/forms/${envContext.id}/${formId}/preview/gov-uk`, {replace: true});
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
