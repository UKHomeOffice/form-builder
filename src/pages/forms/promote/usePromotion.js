import useApiRequest, {useMultipleApiCallbackRequest} from "../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";
import useCommonFormUtils from "../common/useCommonFormUtils";
import createForm from "../../../core/form/createForm";
import useLogger from "../../../core/logging/useLogger";
import {toast} from "react-semantic-toasts";
import {useTranslation} from "react-i18next";

const usePromotion = (formId) => {
    const {log} = useLogger();
    const navigation = useNavigation();
    const {getEnvDetails, envContext} = useEnvContext();
    const {t} = useTranslation();
    const [form, setValue] = useState({
        data: null,
        formId: formId,
        step: 'form',
        disabled: true,
        environment: null
    });
    const {submissionAccess} = useCommonFormUtils();

    const [fetchState, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {}
        }
    );

    const [{status, response}, execute] = useMultipleApiCallbackRequest(async (axios) => {
        try {
            const envDetails = getEnvDetails(form.environment);
            const formResponse = await axios({
                method: 'GET',
                url: `${envDetails.url}/forasdasdm?name=${form.data.name}&path=${form.data.path}&limit=1`
            });
            if (formResponse.data.length === 0) {
                log([{
                    message: `Form ${form.data.name} does not exists in ${envDetails.id}, so creating`,
                    level: 'info'
                }]);
                return await createForm(axios, envDetails, form.data, submissionAccess, log);
            } else {
                log([{
                    message: `Form ${form.data.name} does exists in ${envDetails.id}, so updating`,
                    level: 'info'
                }]);
                const formLoaded = formResponse.data[0];
                delete formLoaded.components;
                formLoaded['components'] = form.data.components;
                return await axios({
                    "method": "PUT",
                    "url": `${envContext.url}/form/${formLoaded._id}`,
                    "data": formLoaded
                });
            }
        } catch (error) {
            throw {
                response: {
                    data: error.toString()
                },
                exception: error
            }
        }
    }, [{
        message: `Initiating form ${form.data ? form.data.name : ''} promotion to ${form.environment}`,
        level: 'info'
    }], [
        {
            message: `${form.data ? form.data.name : ''} successfully promoted to ${form.environment}`,
            level: 'info'
        }
    ]);

    const savedCallback = useRef();

    const successfulPromotionCallback = useRef();

    const callback = () => {
        setValue(form => ({
            ...form,
            data: null
        }));
        makeRequest();
    };

    const successCallback = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
        toast({
            type: 'success',
            icon: 'check circle',
            title: t('form.promote.successful-title', {formName: form.data.name}),
            description: t('form.promote.successful-description', {formName: form.data.name, env: form.environment}),
            animation: 'scale',
            time: 10000
        });
    };

    useEffect(() => {
        savedCallback.current = callback;
        successfulPromotionCallback.current = successCallback;
    });

    useEffect(() => {
        savedCallback.current();
    }, [form.formId]);


    useEffect(() => {
        if (fetchState.status === SUCCESS) {
            setValue(form => ({
                ...form,
                data: fetchState.response.data
            }));
        }
    }, [fetchState.status, fetchState.response, setValue]);

    useEffect(() => {
        if (status === SUCCESS) {
            successfulPromotionCallback.current();
        }
    }, [status]);

    const backToForms = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
    };

    const isDisabled = () => {
        return !form.environment
    };


    return {
        fetchState,
        form,
        setValue,
        isDisabled,
        backToForms,
        status,
        response,
        execute
    }
};

export default usePromotion;
