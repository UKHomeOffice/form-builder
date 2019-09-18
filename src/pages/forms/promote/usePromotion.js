import useApiRequest, {useMultipleApiCallbackRequest} from "../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";
import createForm from "../../../core/form/createForm";
import useLogger from "../../../core/logging/useLogger";
import {useTranslation} from "react-i18next";
import keycloakTokenProvider from "../../../core/auth/KeycloakTokenProvider";
import {useKeycloak} from "react-keycloak";
import Stepper from 'bs-stepper'
import eventEmitter from "../../../core/eventEmitter";
import uuid4 from "uuid4";
import {useToasts} from "react-toast-notifications";
import FormioUtils from "formiojs/utils";
import _ from 'lodash';

const usePromotion = (formId) => {
    const {log} = useLogger();
    const navigation = useNavigation();
    const [keycloak] = useKeycloak();
    const {getEnvDetails, envContext} = useEnvContext();
    const {t} = useTranslation();
    const {addToast} = useToasts();
    const [form, setValue] = useState({
        data: null,
        formId: formId,
        step: 'form',
        disabled: true,
        environment: null,
        stepper: null
    });

    const [fetchState, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {}
        }
    );

    const [{status, response, exception}, execute] = useMultipleApiCallbackRequest(async (axios) => {
        try {
            const promotionEnvironment = getEnvDetails(form.environment);
            const token = await keycloakTokenProvider.fetchKeycloakToken(promotionEnvironment, keycloak);

            const headers = {
                "x-promote-kc-token": `Bearer ${token}`,
            };

            const subFormComponents = FormioUtils.searchComponents(form.data.components, {
                'type': 'form'
            });

            if (!_.isEmpty(subFormComponents)) {
                const subFormIds = subFormComponents.map((subForm) => {
                    return subForm.form;
                });

                const subForms = await Promise.all(subFormIds.map(async (subFormId) => {
                    try {
                        const formData = await axios.get(`${envContext.url}/form/${subFormId}`);
                        return formData.data;
                    } catch (e) {
                        return null;
                    }
                }));

                const subFormsFromEnv = await Promise.all(subForms.filter((subForm) => {
                    return subForm
                }).map(async (subForm) => {
                    const response = await axios.get(`${promotionEnvironment.url}/form?name=${subForm.name}&select=id`);
                    return {
                        id: response.data.total >= 1 ? response.data.forms[0].id : null,
                        subFormToPromote: subForm
                    };
                }));

                await subFormsFromEnv.forEach(async (data) => {
                    let formId;
                    if (data.id) {
                        await axios({
                            method: 'PUT',
                            url: `${promotionEnvironment.url}/form/${data.id}`,
                            data: data.subFormToPromote,
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        formId = data.id;
                        console.log('Updated latest subForm');
                    } else {
                        const result = await axios({
                            method: 'POST',
                            url: `${promotionEnvironment.url}/form`,
                            data: data.subFormToPromote,
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        console.log('New subform created');
                        formId = result.headers['x-form-id'];
                    }

                    FormioUtils.eachComponent(form.data.components, (component) => {
                        if (component.type === 'form' && component.form === data.subFormToPromote.id) {
                            component.form = formId;
                            console.log('Updated subForm reference');
                        }
                    });
                });
            }

            const formResponse = await axios({
                method: 'GET',
                headers: headers,
                url: `${promotionEnvironment.url}/form?filter=name__eq__${form.data.name},path__eq__${form.data.path}&limit=1`
            });
            if (formResponse.data.total === 0) {
                log([{
                    message: `Form ${form.data.name} does not exists in ${promotionEnvironment.id}, so creating`,
                    level: 'info'
                }]);
                return await createForm(axios, promotionEnvironment, form.data, log, headers);
            } else {
                log([{
                    message: `Form ${form.data.name} does exists in ${promotionEnvironment.id}, so updating`,
                    level: 'info'
                }]);
                const formLoaded = formResponse.data.forms[0];
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
                        "url": `${promotionEnvironment.url}/form/${formLoaded.id}`,
                        "data": formLoaded,
                        headers: headers,
                    });
                }

            }
        } catch (error) {
            throw Object.assign(new Error(error.message), {
                response: {
                    data: error
                }
            });
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
