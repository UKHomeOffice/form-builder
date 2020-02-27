import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import useFormDataReplacer from "../../../../core/replacements/useFormDataReplacer";
import {Form, Formio} from 'react-formio';
import './PreviewFormComponent.scss';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretRight, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import Collapse from "react-bootstrap/Collapse";
import Spinner from "react-bootstrap/Spinner";
import useEnvContext from "../../../../core/context/useEnvContext";
import keycloakTokenProvider from "../../../../core/auth/KeycloakTokenProvider";
import {useKeycloak} from "react-keycloak";
import FileService from "../../../../core/FileService";
import FormJsonSchemaEditor from "../../edit/components/FormJsonSchemaEditor";
import eventEmitter from "../../../../core/eventEmitter";

import VariableReplacer from "../../../../core/replacements/VariableReplacer";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import _ from 'lodash';

const PreviewFormComponent = ({
                                  form, submission, mode,
                                  handlePreview,
                                  handleFormioRef,
                                  onRender,
                                  handleEditorModeViewChange
                              }) => {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const cursor = {cursor: 'pointer'};
    const clonedForm = form ? _.cloneDeep(form) : null;
    return <Container>
        <Row>
            <Col>
                <Alert variant="warning" className="border-1">
                    <Alert.Heading><FontAwesomeIcon icon={faExclamationTriangle}/>
                        <span className="m-2" style={cursor} onClick={() => {
                            setOpen(!open)
                        }}><FontAwesomeIcon
                            icon={!open ? faCaretRight : faCaretDown}/></span>
                        <span className="m-0" style={cursor} onClick={() => {
                            setOpen(!open)
                        }}>
                           {t('form.preview.submission-warning-title')}
                        </span>
                    </Alert.Heading>
                    <Collapse in={open}>
                        <div id="collapse-text">
                            <p className="lead">{t('form.preview.submission-warning-description')}</p>
                        </div>
                    </Collapse>
                </Alert>
            </Col>
        </Row>
        <Row>
            <Col>
                {
                    clonedForm ? <React.Fragment>
                        <h2>
                            {clonedForm.title ? clonedForm.title : 'No form title'}
                            <span className="m-2"><small
                                className="text-muted">{clonedForm.name ? clonedForm.name : 'No form name'}</small></span>
                        </h2>
                    </React.Fragment> : null
                }
            </Col>
        </Row>
        <Row>
            <Col>
                <PreviewFormPanel form={clonedForm} formSubmission={submission}
                                  handleFormioRef={handleFormioRef}
                                  onRender={onRender}
                                  handleEditorModeViewChange={handleEditorModeViewChange}
                                  mode={mode}

                                  previewSubmission={(submission, clonedForm) => {
                                      handlePreview(submission, clonedForm)
                                  }}/>
            </Col>
        </Row>
    </Container>
};


export const PreviewFormPanel = ({
                                     form, formSubmission, previewSubmission,
                                     handleFormioRef,
                                     onRender,
                                     mode, handleEditorModeViewChange
                                 }) => {
    const {envContext} = useEnvContext();
    let formioForm;
    const {t} = useTranslation();
    const {performFormParse} = useFormDataReplacer();
    const {keycloak} = useKeycloak();

    const [parsedForm, setParsedForm] = useState({
        isParsing: true,
        form: null

    });
    const [submissionData, setSubmissionData] = useState(null);

    let submissionEditor = null;
    const parseCallBack = useRef();

    const callback = () => {
        performFormParse(form).then((result) => {
            setParsedForm({
                isParsing: false,
                form: result
            })
        });
    };

    useEffect(() => {
        parseCallBack.current = callback;
    });

    useEffect(() => {
        parseCallBack.current();

    }, [form]);


    if (!form) {
        return null;
    }

    if (parsedForm.isParsing) {
        return <div className="center-context">
            <Spinner animation="border" role="status"/>
        </div>
    }
    Formio.baseUrl = `${envContext.url}`;
    Formio.formsUrl = `${envContext.url}/form`;
    Formio.formUrl = `${envContext.url}/form`;
    Formio.projectUrl = `${envContext.url}`;
    const variableReplacer = new VariableReplacer();
    const interpolationPlugin = {
        priority: 0,
        requestResponse: function (response) {
            return {
                ok: response.ok,
                json: () => response.json().then((result) => {
                    if (result.forms) {
                        return result.forms.map((form) => {
                            const updatedForm = variableReplacer.interpolate(form, envContext);
                            updatedForm['_id'] = form.id;
                            return updatedForm;
                        });
                    }
                    const updatedForm = variableReplacer.interpolate(result, envContext);
                    updatedForm['_id'] = result.id;
                    return updatedForm;
                }),
                status: response.status,
                headers: response.headers
            };

        }
    };

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
            requestArgs.opts.header.set('Authorization', `Bearer ${token}`);
            if (!requestArgs.url) {
                requestArgs.url = "";
            }
            requestArgs.url = requestArgs.url.replace("_id", "id");
            return requestArgs;
        },


    }, interpolationPlugin];


    return <React.Fragment>
        <Form form={parsedForm.form}
              submission={submissionData}
              ref={(form) => {
                  formioForm = form;
                  if (handleFormioRef && typeof handleFormioRef === 'function') {
                      handleFormioRef(form);
                  }
                  if (form) {
                      form.createPromise.then(() => {
                          form.formio.on('render', () => {
                              if (onRender) {
                                  onRender(form);
                              }
                          });
                          form.formio.on('error', errors => {
                              eventEmitter.publish("formSubmissionError", {errors: errors, form: form});
                          });
                          form.formio.on('submit', () => {
                              eventEmitter.publish("formSubmissionSuccessful");
                          });
                          form.formio.on('change', (value) => {
                              eventEmitter.publish("formChange", {value, form});
                          });
                      });
                  }
              }}
              onSubmit={(submission) => {
                  if (formioForm && formioForm.formio) {
                      formioForm.submitted = true;
                      formioForm.submitting = true;
                  }
                  previewSubmission(submission, formioForm);

              }}
              options={
                  {
                      breadcrumbSettings: {
                          clickable: false
                      },
                      noAlerts: true,
                      fileService: new FileService(keycloak, envContext, keycloakTokenProvider)
                  }}/>


        <Accordion>
            <Card>
                <Card.Header>
                    <OverlayTrigger
                        key={'left'}
                        placement={'left'}
                        overlay={
                            <Tooltip id={`tooltip-left`}>
                                {t('form.preview.preload.form-submission-description')}
                            </Tooltip>
                        }
                    >
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        {t('form.preview.preload.form-submission-label')} <span> <Badge variant="warning">Experimental</Badge></span>
                    </Accordion.Toggle>
                    </OverlayTrigger>
                </Card.Header>

                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Row>
                            <Col className="mb-5">
                                <FormJsonSchemaEditor
                                    refreshOnContentChange={true}
                                    editor={(editor) => {
                                        submissionEditor = editor;
                                    }}
                                    onChange={(json) => {
                                        try {
                                            setSubmissionData(submissionEditor.get());
                                        } catch (e) {
                                            setSubmissionData(null);
                                        }
                                    }}
                                    handleEditModeView={e => handleEditorModeViewChange(e)}
                                    disableModeSelection={true}
                                    mode={'code'}
                                    indentation={2}
                                />
                            </Col>
                        </Row>

                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <div className="hr-text mb-2" data-content={t('form.preview.form-submission-label')}/>


        <FormJsonSchemaEditor
            readonly={true}
            refreshOnContentChange={true}
            handleEditModeView={e => handleEditorModeViewChange(e)}
            json={formSubmission ? formSubmission : {}}
            mode={mode ? mode : 'code'}
            indentation={2}
        />
    </React.Fragment>
};


export default PreviewFormComponent;





