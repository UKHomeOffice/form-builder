import React from 'react';
import {EXECUTING} from "../../../../core/api/actionTypes";
import usePromotion from "../usePromotion";
import {useTranslation} from "react-i18next";
import EnvironmentPanel from "./EnvironmentPanel";
import ConfirmPanel from "./ConfirmPanel";
import FormToPromotePanel from "./FormToPromotePanel";
import Container from "react-bootstrap/Container";
import "bs-stepper/dist/css/bs-stepper.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWpforms} from '@fortawesome/free-brands-svg-icons'
import {faCogs, faInfo} from "@fortawesome/free-solid-svg-icons";
import {TextSpinner} from "../../../../common/Overlay";
import {Formio} from "react-formio";
import keycloakTokenProvider from "../../../../core/auth/KeycloakTokenProvider";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useKeycloak} from "react-keycloak";

const FormPromotionPage = ({formId}) => {
    const {fetchState, form, setValue, backToForms, isDisabled, status, execute} = usePromotion(formId);
    const {t} = useTranslation();
    const {envContext} = useEnvContext();
    const {keycloak} = useKeycloak();

    if (!fetchState.status || fetchState.status === EXECUTING) {
        return <TextSpinner loadingText={t('form.loading-form')} styleName="mt-5"/>
    }
    Formio.baseUrl = `${envContext.url}`;
    Formio.formsUrl = `${envContext.url}/form`;
    Formio.formUrl = `${envContext.url}/form`;
    Formio.projectUrl = `${envContext.url}`;
    Formio.plugins = [{
        priority: 0,
        preRequest: async function (requestArgs) {
            if (!requestArgs.opts) {
                requestArgs.opts = {};
            }
            if (!requestArgs.opts.header) {
                requestArgs.opts.header = new Headers();
                if (requestArgs.method !== 'upload') {
                    requestArgs.opts.header.set('Accept', 'application/json');
                    requestArgs.opts.header.set('Content-type', 'application/json; charset=UTF-8');
                } else {
                    requestArgs.opts.header.set('Content-type', requestArgs.file.type);
                }
            }
            const token = await keycloakTokenProvider.fetchKeycloakToken(envContext, keycloak);
            requestArgs.opts.header.set('x-user-email', keycloak.tokenParsed.email);
            requestArgs.opts.header.set('Authorization', `Bearer ${token}`);
            if (!requestArgs.url) {
                requestArgs.url = "";
            }
            requestArgs.url = requestArgs.url.replace("_id", "id");
            return requestArgs;
        },


    },

        {
            priority: 0,
            requestResponse: function (response) {
                return {
                    ok: response.ok,
                    json: () => response.json().then((result) => {
                        if (result.forms) {
                            return result.forms.map((form) => {
                                form['_id'] = form.id;
                                return form;
                            });
                        }
                        result['_id'] = result.id;
                        return result;
                    }),
                    status: response.status,
                    headers: response.headers
                };

            }
        }];
    return <Container>
        <div id="promotionStepper" className="bs-stepper">
            <div className="bs-stepper-header" role="tablist">
                <div className="step" data-target="#form-selection-part">
                    <button type="button" className="step-trigger" role="tab"
                            aria-controls="form-selection-part"
                            id="form-selection-part-trigger">
                        <span className="bs-stepper-circle"><span>
                            <FontAwesomeIcon icon={faWpforms}/>
                        </span></span>
                        <span className="bs-stepper-label">Form</span>
                    </button>
                </div>
                <div className="line"/>
                <div className="step" data-target="#environment-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="environment-part"
                            id="environment-part-trigger">
                        <span className="bs-stepper-circle"><span><FontAwesomeIcon icon={faCogs}/></span></span>
                        <span className="bs-stepper-label">Environment</span>
                    </button>
                </div>
                <div className="line"/>
                <div className="step" data-target="#confirm-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="confirm-part"
                            id="confirm-part-trigger">
                        <span className="bs-stepper-circle"><span><FontAwesomeIcon icon={faInfo}/></span></span>
                        <span className="bs-stepper-label">Confirm</span>
                    </button>
                </div>
            </div>
            <div className="bs-stepper-content">
                <div id="form-selection-part" className="content" role="tabpanel"
                     aria-labelledby="form-selection-part-trigger">
                    <FormToPromotePanel form={form} backToForms={backToForms}/>
                </div>
                <div id="environment-part" className="content" role="tabpanel"
                     aria-labelledby="environment-part-trigger">
                    <EnvironmentPanel form={form} setValue={setValue}
                                      isDisabled={isDisabled}/>
                </div>
                <div id="confirm-part" className="content" role="tabpanel" aria-labelledby="confirm-part-trigger">
                    <ConfirmPanel form={form} backToForms={backToForms}
                                  setValue={setValue} promote={execute} status={status}/>
                </div>
            </div>
        </div>
    </Container>

};

export default FormPromotionPage;
