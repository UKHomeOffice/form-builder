import useApiRequest, {useProxyApiRequest} from "../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";
import {useTranslation} from "react-i18next";
import Stepper from 'bs-stepper'
import eventEmitter from "../../../core/eventEmitter";
import uuid4 from "uuid4";
import {useToasts} from "react-toast-notifications";

const usePromotion = (formId) => {
    const navigation = useNavigation();
    const {getEnvDetails, envContext} = useEnvContext();
    const {t} = useTranslation();
    const {addToast} = useToasts();
    const [form, setValue] = useState({
        data: null,
        latestForm: null,
        formId: formId,
        step: 'form',
        disabled: true,
        environment: null,
        stepper: null,
        versionId: null,
        promoteSpecificVersion: false,
        versionsToCompare: null
    });

    const [fetchState, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {}
        }
    );

    const [{status, response, exception}, execute] = useProxyApiRequest(
        `/ui/promotion`, {
            verb: 'post', params: {
                form: form.data,
                env: getEnvDetails(form.environment),
                currentEnv: envContext
            }
        }
    );

    const savedCallback = useRef();

    const successfulPromotionCallback = useRef();

    const handleFailedPromotion = useRef();

    const handleFailedToLoadForm = useRef();

    const callback = () => {
        setValue(form => ({
            ...form,
            data: null
        }));

        makeRequest();
    };


    const handleFailedToLoadFormCallback = () => {
        eventEmitter.publish('error', {
            id: uuid4(),
            exception: fetchState.exception,
            response: fetchState.response,
            translateKey: 'form.promote.failed-to-load-form',
            translateKeyMeta: {
                formName: form.data.name
            }
        });

    };
    const handleFailedPromotionCallback = () => {
        eventEmitter.publish('error', {
            translateKey: `form.promote.failed-to-promote`,
            translateKeyMeta: {
                formName: form.data.name
            },
            id: uuid4(),
            exception: exception,
            response: response
        });
    };


    const successCallback = () => {
        const promotionEnvironment = getEnvDetails(form.environment);
        let message;

        if (promotionEnvironment.approvalUrl) {
            message = t('form.promote.approval.successful-description', {
                formName: form.data.name,
                env: promotionEnvironment.label
            });
        } else {
            message = t('form.promote.successful-description', {
                formName: form.data.name,
                env: promotionEnvironment.label
            })
        }

        addToast(`${message}`, {
            appearance: 'success',
            autoDismiss: true,
            id: uuid4()
        });

        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
    };

    useEffect(() => {
        savedCallback.current = callback;
        successfulPromotionCallback.current = successCallback;
        handleFailedPromotion.current = handleFailedPromotionCallback;
        handleFailedToLoadForm.current = handleFailedToLoadFormCallback;
    });

    useEffect(() => {
        savedCallback.current();
    }, [form.formId]);


    useEffect(() => {
        if (fetchState.status === SUCCESS) {
            setValue(form => ({
                ...form,
                data: fetchState.response.data,
                latestForm: fetchState.response.data,
                stepper: new Stepper(document.querySelector('#promotionStepper'), {
                    linear: true,
                    animation: true
                })
            }));
        }
        if (fetchState.status === ERROR) {
            handleFailedToLoadForm.current();
        }

    }, [fetchState.status, fetchState.response, setValue]);

    useEffect(() => {
        if (status === SUCCESS) {
            successfulPromotionCallback.current();
        }
        if (status === ERROR) {
            handleFailedPromotion.current();
        }
    }, [status]);

    const backToForms = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
    };

    const isDisabled = () => {
        return !form.environment
    };

    const handleSpecificVersion = () => {
        setValue(form => ({
            ...form,
            data: (!form.promoteSpecificVersion ? null : form.latestForm),
            promoteSpecificVersion: !form.promoteSpecificVersion
        }));
    };

    const selectVersionToPromote = (version) => {
        setValue(form => ({
            ...form,
            data: {
                versionId: version.versionId,
                ...version.schema
            }
        }));
    };

    return {
        fetchState,
        form,
        setValue,
        isDisabled,
        backToForms,
        status,
        response,
        execute,
        handleSpecificVersion,
        selectVersionToPromote
    }
};

export default usePromotion;
