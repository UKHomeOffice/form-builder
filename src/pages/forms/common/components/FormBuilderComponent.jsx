import React from 'react';
import {FormBuilder} from 'react-formio';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import './FormBuilderComponent.scss';
import Button from "react-bootstrap/Button";
import {EXECUTING} from "../../../../core/api/actionTypes";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import PreviewFormModal from "../../create/components/PreviewFormModal";

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
                                  changeDisplay
                              }) => {


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
                                                      value={form.data.title}
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
                                                      value={form.data.name}
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
                                                      value={form.data.path}
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
                                                      defaultValue={form.data.display}
                                                      onChange={(e) => {
                                                          changeDisplay(e.target.value)
                                                      }}>
                                            {formChoices.map((choice) => {
                                                return <option key={choice.key} value={choice.value}>{choice.text}</option>
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
                        components: form.data.components,
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
                        <Button data-cy="edit-form"
                                variant="secondary"
                                className="mr-2"
                                onClick={() => backToForms()}>{t('form.cancel.label')}</Button>
                        <Button data-cy="preview-form"
                                variant="dark"
                                className="mr-2"
                                onClick={() =>  openPreview()}>{t('form.preview.label')}</Button>
                        <Button data-cy="persist-form"
                                variant="primary"
                                disabled={formInvalid()}
                                onClick={() => save()}>{status === EXECUTING ? t(`${messageKeyPrefix}.updating-label`) : t(`${messageKeyPrefix}.update-label`)}</Button>

                    </ButtonToolbar>
                </Container>
            </Row>
        </Container>

        // return <Container>
        //     <Form className='attached fluid segment'>
        //         <Form.Group widths='equal'>
        //             <Form.Field>
        //                 <Form.Input value={form.data.title} name="title" fluid
        //                             label={t(`${messageKeyPrefix}.form-title.label`)}
        //                             placeholder={t(`${messageKeyPrefix}.form-title.placeholder`)} type='text'
        //                             error={form.missing.title}
        //                             onChange={(e) => {
        //                                 updateField(e.target.name, e.target.value);
        //                             }}/>
        //                 {form.missing.title ?
        //                     <Label basic color='red' pointing>
        //                         {t(`${messageKeyPrefix}.form-title.missing`)}
        //                     </Label> : null}
        //             </Form.Field>
        //             <Form.Field>
        //                 <Form.Input name="name" fluid label={t(`${messageKeyPrefix}.form-name.label`)}
        //                             placeholder={t(`${messageKeyPrefix}.form-name.placeholder`)} type='text'
        //                             error={form.missing.name}
        //                             onChange={(e) => updateField(e.target.name, e.target.value)}
        //                             value={form.data.name}/>
        //                 {form.missing.name ?
        //                     <Label basic color='red' pointing>
        //                         {t(`${messageKeyPrefix}.form-name.missing`)}
        //                     </Label> : null}
        //             </Form.Field>
        //         </Form.Group>
        //         <Form.Group widths='equal'>
        //             <Form.Field>
        //                 <Form.Input name="path" label={t(`${messageKeyPrefix}.form-path.label`)}
        //                             placeholder={t(`${messageKeyPrefix}.form-path.placeholder`)} type='text'
        //                             onChange={(e) => updateField(e.target.name, e.target.value)}
        //                             error={form.missing.path} value={form.data.path}/>
        //                 {form.missing.path ?
        //                     <Label basic color='red' pointing>
        //                         {t(`${messageKeyPrefix}.form-path.missing`)}
        //                     </Label> : null}
        //
        //             </Form.Field>
        //             <Form.Field>
        //                 <Form.Dropdown label={t(`${messageKeyPrefix}.form-type.select`)}
        //                                data-cy="displayType"
        //                                placeholder={t(`${messageKeyPrefix}.form-type.select-placeholder`)}
        //                                openOnFocus
        //                                selection
        //                                clearable
        //                                options={formChoices}
        //                                defaultValue={form.data.display}
        //                                onChange={(e, {name, value}) => {
        //                                    changeDisplay(value)
        //                                }}
        //                 />
        //             </Form.Field>
        //         </Form.Group>
        //         <Divider clearing/>
        //         <FormBuilder form={{
        //             display: form.data.display,
        //             components: form.data.components,
        //             title: form.data.title,
        //             name: form.data.name,
        //             path: form.data.path
        //         }} onChange={updateForm}/>
        //         <Divider clearing/>
        //         <Container><PreviewFormModal form={form.data} title={form.title} open={form.displayPreview}
        //                                      onClosePreview={closePreview}/></Container>
        //         <div style={{paddingTop: '10px'}}>
        //             <Button.Group size='large'>
        //                 <Button onClick={() => {
        //                     backToForms();
        //                 }}>{t('form.cancel.label')}</Button>
        //                 <Button.Or/>
        //                 <Button onClick={() => {
        //                     openPreview();
        //                 }} secondary>{t('form.preview.label')}</Button>
        //                 <Button.Or/>
        //                 <Button data-cy="persist-form"
        //                         onClick={() => save()}
        //                         primary
        //                         disabled={formInvalid()}
        //                         loading={status === EXECUTING}>{status === EXECUTING ? t(`${messageKeyPrefix}.updating-label`) : t(`${messageKeyPrefix}.update-label`)}</Button>
        //
        //             </Button.Group></div>
        //     </Form>
        // </Container>
    }
;


export default FormBuilderComponent;
