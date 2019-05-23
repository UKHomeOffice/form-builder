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
import {KeycloakTokenProvider} from "../../../core/KeycloakTokenProvider";
import {useKeycloak} from "react-keycloak";
import FormioTokenProvider from "../../../core/form/FormioTokenProvider";

const usePromotion = (formId) => {
    const {log} = useLogger();
    const navigation = useNavigation();
    const [keycloak] = useKeycloak();
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

    const keycloakTokenProvider = new KeycloakTokenProvider();
    const formioTokenProvider = new FormioTokenProvider();

    const [fetchState, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {}
        }
    );

    const [{status, response}, execute] = useMultipleApiCallbackRequest(async (axios) => {
        try {
            const promotionEnvironment = getEnvDetails(form.environment);
            const token = await keycloakTokenProvider.fetchKeycloakToken(promotionEnvironment, keycloak.token);
            const formioToken = await formioTokenProvider.fetchToken(promotionEnvironment, keycloak.token);

            const headers = {
                "x-promote-kc-token": `Bearer ${token}`,
                "x-promote-formio-token" : formioToken
            };
            const formResponse = await axios({
                method: 'GET',
                headers: headers,
                url: `${promotionEnvironment.url}/form?name=${form.data.name}&path=${form.data.path}&limit=1`
            });
            if (formResponse.data.length === 0) {
                log([{
                    message: `Form ${form.data.name} does not exists in ${promotionEnvironment.id}, so creating`,
                    level: 'info'
                }]);
                return await createForm(axios, promotionEnvironment, form.data, submissionAccess, log, headers);
            } else {
                log([{
                    message: `Form ${form.data.name} does exists in ${promotionEnvironment.id}, so updating`,
                    level: 'info'
                }]);
                const formLoaded = formResponse.data[0];
                delete formLoaded.components;
                formLoaded['components'] = form.data.components;

                if (promotionEnvironment.approvalUrl) {
                    return await axios({
                        "method": "POST",
                        "url": `${promotionEnvironment.approvalUrl}`,
                        "data": formLoaded,
                        headers: headers,
                    });
                } else {
                    return await axios({
                        "method": "PUT",
                        "url": `${promotionEnvironment.url}/form/${formLoaded._id}`,
                        "data": formLoaded,
                        headers: headers,
                    });
                }

            }
        } catch (error) {
            throw {
                response: {
                    data: error.toString()
                },
                exception: error
            };
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
        const promotionEnvironment = getEnvDetails(form.environment);
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
        toast({
            type: 'success',
            icon: 'check circle',
            title: promotionEnvironment.approvalUrl ? t('form.promote.approval.successful-title', {formName: form.data.name}) : t('form.promote.successful-title', {
                formName: form.data.name,
                env: promotionEnvironment.label
            }),
            description: promotionEnvironment.approvalUrl ? t('form.promote.approval.successful-description', {
                formName: form.data.name,
                env: promotionEnvironment.label
            }) : t('form.promote.successful-description', {formName: form.data.name, env: promotionEnvironment.label}),
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
