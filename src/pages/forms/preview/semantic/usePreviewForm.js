import useApiRequest from "../../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {SUCCESS} from "../../../../core/api/actionTypes";
import useEnvContext from "../../../../core/context/useEnvContext";
import {Formio} from "react-formio";
import axios from "axios";
import _ from 'lodash';
import FormioUtils from 'formiojs/utils';
import useCommonFormUtils from "../../common/useCommonFormUtils";

const usePreviewForm = (formId) => {

    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {handleForm} = useCommonFormUtils();

    const [form, setValue] = useState({
        data: null,
        formId: formId,
        submission: null,
        openSchemaView: false
    });

    const isMounted = useRef(true);
    const CancelToken = axios.CancelToken;
    const cancelPreview = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {cancelToken: cancelPreview.current.token}
        }
    );

    const savedCallback = useRef();

    const callback = () => {
        Formio.Templates.framework = "semantic";
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
            Formio.Templates.framework = "semantic";
        }
    }, [form.formId]);


    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                const data = response.data;
                handleForm(data);
                setValue(form => ({
                    ...form,
                    data: data
                }));
            }
        }
    }, [response, status, setValue, handleForm]);

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

    const openSchemaView = () => {
        setValue(form => ({
            ...form,
            openSchemaView: true
        }));
    };

    const closeSchemaView = () => {
        setValue(form => ({
            ...form,
            openSchemaView: false
        }));
    };

    const duplicate = async () => {
        const copiedForm = _.cloneDeep(form.data);
        delete copiedForm.id;
        copiedForm.title = "Copy of " + form.data.title;
        copiedForm.name = "Copy of " + form.data.name;
        copiedForm.path = "Copy of " + form.data.path;

        await navigation.navigate(`/forms/${envContext.id}/create/duplicate`, {
            body: JSON.stringify(copiedForm),
            replace: true
        })
    };

    const edit = async () => {
        await navigation.navigate(`/forms/${envContext.id}/${formId}/edit`, {replace: true});
    };

    const parseCss = (form) => {
        FormioUtils.eachComponent(form.components, (component) => {
            if (component.customClass && component.customClass.indexOf('-govuk-') >= 0) {
                component.customClass = "";
            }
        });
        return form;
    };

    const reload = () => {
        makeRequest();
    };

    return {
        previewSubmission,
        status,
        form,
        response,
        backToForms,
        previewInGDS,
        openSchemaView,
        closeSchemaView,
        duplicate,
        edit,
        parseCss,
        exception,
        reload
    }
};

export default usePreviewForm;
