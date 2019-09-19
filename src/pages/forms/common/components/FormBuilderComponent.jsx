import React from 'react';
import {FormBuilder, Formio} from 'react-formio';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {EXECUTING} from "../../../../core/api/actionTypes";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import PreviewFormModal from "../../create/components/PreviewFormModal";
import useEnvContext from "../../../../core/context/useEnvContext";
import keycloakTokenProvider from '../../../../core/auth/KeycloakTokenProvider';
import {useKeycloak} from "react-keycloak";
import '../../../../core/form/SubFormComponent';

const FormBuilderComponent = ({
                                  form,
                                  updateField,
                                  messageKeyPrefix,
                                  updateForm,
                                  status,
                                  backToForms,
                                  closePreview,
                                  formChoices,
                                  t,
                                  openPreview,
                                  save,
                                  formInvalid,
                                  changeDisplay,
                                  editSchemaView,

                              }) => {
    const {envContext} = useEnvContext();
    const {keycloak} = useKeycloak();
    Formio.baseUrl = `${envContext.url}`;
    Formio.formsUrl = `${envContext.url}/form`;
    Formio.formUrl = `${envContext.url}/form`;
    Formio.projectUrl = `${envContext.url}`;
    Formio.plugins = [{
        priority: 0,
        preRequest: async function (requestArgs) {
            if (!requestArgs.opts.header) {
                requestArgs.opts.header = new Headers({
                    'Accept': 'application/json',
                    'Content-type': 'application/json; charset=UTF-8'
                });
            }
            const token = await keycloakTokenProvider.fetchKeycloakToken(envContext, keycloak);
            requestArgs.opts.header.set('Authorization', `Bearer ${token}`);
            requestArgs.url = requestArgs.url.replace("_id", "id");
            return requestArgs;
        }
    }, {
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
        <Row>
            <Container>
                <Row>
                    <Col>
                        <hr className="hr-text" data-content={t('form.details')}/>
                    </Col>
                </Row>
                <Row className="justify-content-center align-items-center">
                    <Col>
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="title">
                                    <Form.Label
                                        className="font-weight-bold">{t(`${messageKeyPrefix}.form-title.label`)}</Form.Label>
                                    <Form.Control type="text"
                                                  required
                                                  name="title"
                                                  defaultValue={form.data.title}
                                                  onChange={(event) => updateField("title", event.target.value)}
                                                  isInvalid={form.missing.title}
                                                  placeholder={t(`${messageKeyPrefix}.form-title.placeholder`)}/>
                                    <Form.Control.Feedback type="invalid">
                                        {t(`${messageKeyPrefix}.form-title.missing`)}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="name">
                                    <Form.Label
                                        className="font-weight-bold">{t(`${messageKeyPrefix}.form-name.label`)}</Form.Label>
                                    <Form.Control type="text"
                                                  required
                                                  name="name"
                                                  defaultValue={form.data.name}
                                                  onChange={(event) => updateField("name", event.target.value)}
                                                  isInvalid={form.missing.name}
                                                  placeholder={t(`${messageKeyPrefix}.form-name.placeholder`)}/>
                                    <Form.Control.Feedback type="invalid">
                                        {t(`${messageKeyPrefix}.form-name.missing`)}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="path">
                                    <Form.Label
                                        className="font-weight-bold">{t(`${messageKeyPrefix}.form-path.label`)}</Form.Label>
                                    <Form.Control type="text"
                                                  required
                                                  name="path"
                                                  defaultValue={form.data.path}
                                                  onChange={(event) => updateField("path", event.target.value)}
                                                  isInvalid={form.missing.path}
                                                  placeholder={t(`${messageKeyPrefix}.form-path.placeholder`)}/>
                                    <Form.Control.Feedback type="invalid">
                                        {t(`${messageKeyPrefix}.form-path.missing`)}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="display">
                                    <Form.Label
                                        className="font-weight-bold">{t(`${messageKeyPrefix}.form-type.select`)}</Form.Label>

                                    <Form.Control as="select"
                                                  data-cy="displayType"
                                                  placeholder={t(`${messageKeyPrefix}.form-type.select-placeholder`)}
                                                  value={form.data.display}
                                                  onChange={(e) => {
                                                      changeDisplay(e.target.value)
                                                  }}>
                                        {formChoices.map((choice) => {
                                            return <option key={choice.key}
                                                           value={choice.value}>{choice.text}</option>
                                        })}

                                    </Form.Control>
                                </Form.Group>

                            </Form.Row>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </Row>
        <Row>
            <Col>
                <hr className="hr-text" data-content={t('form.create.choice.form-builder-label')}/>
            </Col>
        </Row>
        <Row>
            <Container>
                <FormBuilder form={{
                    display: form.data.display,
                    components: form.data.components ? form.data.components : [],
                    title: form.data.title,
                    name: form.data.name,
                    path: form.data.path
                }} onChange={updateForm}/>
            </Container>
        </Row>
        <Row>
            <Col>
                <hr className="hr-text" data-content={t('form.create.actions')}/>
            </Col>
        </Row>
        <PreviewFormModal form={form.data} title={form.title} open={form.displayPreview}
                          onClosePreview={closePreview}/>
        <Row>
            <Container>
                <ButtonToolbar>
                    <Button data-cy="cancel-edit-form"
                            variant="secondary"
                            className="mr-2"
                            onClick={() => backToForms()}>{t('form.cancel.label')}</Button>
                    {editSchemaView && (typeof editSchemaView === 'function')? <Button data-cy="edit-schema-form"
                        variant="info"
                        className="mr-2"
                        onClick={async () => await editSchemaView()}>{t('form.schema.edit.label')}</Button> : null}
                    <Button data-cy="preview-form"
                            variant="dark"
                            className="mr-2"
                            onClick={() => openPreview()}>{t('form.preview.label')}</Button>
                    <Button data-cy="persist-form"
                            variant="primary"
                            disabled={formInvalid()}
                            onClick={() => save()}>{status === EXECUTING ? t(`${messageKeyPrefix}.updating-label`) : t(`${messageKeyPrefix}.update-label`)}</Button>

                </ButtonToolbar>
            </Container>
        </Row>
    </Container>

};


export default FormBuilderComponent;
