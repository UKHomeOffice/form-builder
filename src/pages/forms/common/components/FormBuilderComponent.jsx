import React from 'react';
import {Button, Container, Divider, Form, Label} from "semantic-ui-react";
import {EXECUTING} from "../../../../core/api/actionTypes";
import {FormBuilder} from 'react-formio';
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

        return <Container fluid>
            <Form className='attached fluid segment'>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Form.Input value={form.data.title} name="title" fluid
                                    label={t(`${messageKeyPrefix}.form-title.label`)}
                                    placeholder={t(`${messageKeyPrefix}.form-title.placeholder`)} type='text'
                                    error={form.missing.title}
                                    onChange={(e) => {
                                        updateField(e.target.name, e.target.value);
                                    }}/>
                        {form.missing.title ?
                            <Label basic color='red' pointing>
                                {t(`${messageKeyPrefix}.form-title.missing`)}
                            </Label> : null}
                    </Form.Field>
                    <Form.Field>
                        <Form.Input name="name" fluid label={t(`${messageKeyPrefix}.form-name.label`)}
                                    placeholder={t(`${messageKeyPrefix}.form-name.placeholder`)} type='text'
                                    error={form.missing.name}
                                    onChange={(e) => updateField(e.target.name, e.target.value)}
                                    value={form.data.name}/>
                        {form.missing.name ?
                            <Label basic color='red' pointing>
                                {t(`${messageKeyPrefix}.form-name.missing`)}
                            </Label> : null}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Form.Input name="path" label={t(`${messageKeyPrefix}.form-path.label`)}
                                    placeholder={t(`${messageKeyPrefix}.form-path.placeholder`)} type='text'
                                    onChange={(e) => updateField(e.target.name, e.target.value)}
                                    error={form.missing.path} value={form.data.path}/>
                        {form.missing.path ?
                            <Label basic color='red' pointing>
                                {t(`${messageKeyPrefix}.form-path.missing`)}
                            </Label> : null}

                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown label={t(`${messageKeyPrefix}.form-type.select`)}
                                       data-cy="displayType"
                                       placeholder={t(`${messageKeyPrefix}.form-type.select-placeholder`)}
                                       openOnFocus
                                       selection
                                       clearable
                                       options={formChoices}
                                       defaultValue={form.data.display}
                                       onChange={(e, {name, value}) => {
                                           changeDisplay(value)
                                       }}
                        />
                    </Form.Field>
                </Form.Group>
                <Divider clearing/>
                <FormBuilder form={{
                    display: form.data.display,
                    components: form.data.components,
                    title: form.data.title,
                    name: form.data.name,
                    path: form.data.path
                }} onChange={updateForm}/>
                <Divider clearing/>
                <Container><PreviewFormModal form={form.data} title={form.title} open={form.displayPreview}
                                             onClosePreview={closePreview}/></Container>
                <div style={{paddingTop: '10px'}}>
                    <Button.Group size='large'>
                        <Button onClick={() => {
                            backToForms();
                        }}>{t('form.cancel.label')}</Button>
                        <Button.Or/>
                        <Button onClick={() => {
                            openPreview();
                        }} secondary>{t('form.preview.label')}</Button>
                        <Button.Or/>
                        <Button data-cy="persist-form"
                                onClick={() => save()}
                                primary
                                disabled={formInvalid()}
                                loading={status === EXECUTING}>{status === EXECUTING ? t(`${messageKeyPrefix}.updating-label`) : t(`${messageKeyPrefix}.update-label`)}</Button>

                    </Button.Group></div>
            </Form>
        </Container>
    }
;


export default FormBuilderComponent;
