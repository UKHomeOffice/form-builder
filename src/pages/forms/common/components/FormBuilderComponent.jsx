import React from 'react';
import {EXECUTING} from "../../../../core/api/actionTypes";
import {FormBuilder} from 'react-formio';
import PreviewFormModal from "../../create/components/PreviewFormModal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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
        <hr className="hr-text" data-content="AND"/>
        <Row>
            <Form>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Address</Form.Label>
                    <Form.Control placeholder="1234 Main St" />
                </Form.Group>

                <Form.Group controlId="formGridAddress2">
                    <Form.Label>Address 2</Form.Label>
                    <Form.Control placeholder="Apartment, studio, or floor" />
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>State</Form.Label>
                        <Form.Control as="select">
                            <option>Choose...</option>
                            <option>...</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Zip</Form.Label>
                        <Form.Control />
                    </Form.Group>
                </Form.Row>

                <Form.Group id="formGridCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Row>
        <Row>

        </Row>
        <Row></Row>
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
