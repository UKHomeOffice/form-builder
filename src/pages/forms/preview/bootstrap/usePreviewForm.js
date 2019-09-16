import useApiRequest from "../../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {ERROR, SUCCESS} from "../../../../core/api/actionTypes";
import useEnvContext from "../../../../core/context/useEnvContext";
import {Formio} from "react-formio";
import axios from "axios";
import _ from 'lodash';
import FormioUtils from 'formiojs/utils';
import useCommonFormUtils from "../../common/useCommonFormUtils";
import eventEmitter from "../../../../core/eventEmitter";
import uuid4 from "uuid4";

const usePreviewForm = (formId) => {

    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {handleForm} = useCommonFormUtils();

    const [form, setValue] = useState({
        data: null,
        formId: formId,
        submission: null,
        openSchemaView: false,
        tabKey: 'details',
        disableAllActions: false,
        openFormSchemaSubmissionView: false,
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
    const handleSuccessfulFormLoad = useRef();
    const handleFailedFormLoad = useRef();

    const callback = () => {
        setValue(form => ({
            ...form,
            data: null
        }));
        makeRequest();
    };


    const successfulFormLoadCallback = () => {
        const data = response.data;
        handleForm(data);
        setValue(form => ({
            ...form,
            data: data
        }));
    };
    const failedToLoadFormCallback = () => {

        setValue(form => ({
            ...form,
            disableAllActions: true
        }));
        eventEmitter.publish('error', {
            id: uuid4(),
            response: response,
            exception: exception
        });
    };

    useEffect(() => {
        savedCallback.current = callback;
        handleFailedFormLoad.current = failedToLoadFormCallback;
        handleSuccessfulFormLoad.current = successfulFormLoadCallback;
    });

    useEffect(() => {
        savedCallback.current();
        const cancelPreviewRef = cancelPreview.current;
        return () => {
            cancelPreviewRef.cancel("Cancelling preview request");
            isMounted.current = false;
            Formio.clearCache();
        }
    }, [form.formId]);


    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                handleSuccessfulFormLoad.current();
            }
        }
        if (status === ERROR) {
            if (isMounted.current) {
                handleFailedFormLoad.current();
            }
        }
    }, [status]);

    const backToForms = async () => {
        await navigation.navigate(`/forms/${envContext.id}`, {replace: true});
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
    const setTabKey = (tabKey) => {
        setValue(form => ({
            ...form,
            tabKey: tabKey
        }));
        if (tabKey === 'details') {
            makeRequest();
        }
    };
    const duplicate = async () => {
        const copiedForm = _.cloneDeep(form.data);
        delete copiedForm.id;

        copiedForm.title = "Copy of " + form.data.title;
        copiedForm.name = _.toLower("Copy of " + form.data.name).replace(/\s/g, '');
        copiedForm.path = _.camelCase("Copy of " + form.data.path);

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

    const parseSubmissionSchema = (form) => {
        const submission = {};
        FormioUtils.eachComponent(form.components, (component, path) => {

        });
        return submission;
    };

    const closeFormSubmissionSchemaView = () => {
        setValue(form => ({
            ...form,
            openFormSchemaSubmissionView: false
        }));
    };

    const openFormSubmissionSchemaView = () => {
        setValue(form => ({
            ...form,
            openFormSchemaSubmissionView: true
        }));
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
        setTabKey,
        parseSubmissionSchema,
        openFormSubmissionSchemaView,
        closeFormSubmissionSchemaView
    }
};

export default usePreviewForm;
