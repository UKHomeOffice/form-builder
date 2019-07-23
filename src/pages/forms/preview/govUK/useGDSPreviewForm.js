import useApiRequest from "../../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {SUCCESS} from "../../../../core/api/actionTypes";
import {Formio} from "react-formio";
import govukFormioTemplate from "./govuk-formio-template";
import { initAll } from 'govuk-frontend'

const useGDSPreviewForm = (formId) => {
    const navigation = useNavigation();

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
        Formio.Templates.current = govukFormioTemplate;
        initAll();
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
            Formio.Templates.framework = "semantic";
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
        navigation.navigate("/forms", {replace: true});
    };

    const previewSubmission = (submission) => {
        setValue(form => ({
            ...form,
            submission: submission
        }));
    };


    return {
        previewSubmission,
        status,
        form,
        response,
        backToForms
    }
};

export default useGDSPreviewForm;
