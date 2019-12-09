import useApiRequest from "../../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {SUCCESS} from "../../../../core/api/actionTypes";
import {Formio} from "react-formio";
import gds from '@digitalpatterns/formio-gds-template';


const useGDSPreviewForm = (formId) => {

    Formio.use(gds);
    const navigation = useNavigation();
    const [form, setValue] = useState({
        data: null,
        formId: formId,
        submission: null,
        jsonEditorMode: "code",
    });
    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${formId}?disableDataContext=true`, {
            verb: 'get', params: {}
        }
    );

    const savedCallback = useRef();

    const callback = () => {

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
            Formio.clearCache();
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

    const previewSubmission = (submission, formioForm) => {
        if (formioForm) {
            formioForm.formio.emit('submitDone');
        }
        setValue(form => ({
            ...form,
            submission: submission
        }));
    };
    const handleEditorModeViewChange = (e) => {
        const mode = e.target.value;
        if (mode === 'text' || mode === 'code') {
            document.getElementById("jsoneditor").style.height = '700px';
        } else {
            document.getElementById("jsoneditor").style.height = 'auto';
        }
        setValue(form => ({
            ...form,
            jsonEditorMode: mode
        }));
    };

    return {
        previewSubmission,
        status,
        form,
        response,
        backToForms,
        handleEditorModeViewChange
    }
};

export default useGDSPreviewForm;
