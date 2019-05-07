import React from 'react';
import {FormBuilder, Formio} from 'react-formio';
import {Button, Divider, Form, Icon, Label, Message} from 'semantic-ui-react'
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import useCreateForm from "../useCreateForm";
import './CreateFormBuilder.scss';
import {useTranslation} from "react-i18next";
import PreviewFormModal from "./PreviewFormModal";

Formio.Templates.framework = 'semantic';

const CreateFormBuilder = () => {
    const {t} = useTranslation();
    const {
        backToForms,
        status,
        response,
        makeRequest,
        formInvalid,
        form,
        setValues,
        updateField,
        openPreview,
        closePreview
    } = useCreateForm();

    const formChoices = [{
        key: 'form',
        text: t('form.create.form-type.form'),
        value: 'form'
    }, {
        key: 'wizard',
        text: t('form.create.form-type.wizard'),
        value: 'wizard'
    }];

    return <div style={{paddingBottom: '10px'}}>
        {status === ERROR ? <Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>{t('error.general')}</Message.Header>
                {t('form.create.failure.failed-to-create', {error: JSON.stringify(response.data)})}
            </Message.Content>
        </Message> : null}
        <Form className='attached fluid segment'>
            <Form.Group widths='equal'>
                <Form.Field>
                    <Form.Input name="title" fluid label={t('form.create.form-title.label')} placeholder={t('form.create.form-title.placeholder')} type='text'
                                error={form.missing.title}
                                onChange={(e) => {
                                    updateField(e.target.name, e.target.value);
                                }}/>
                    {form.missing.title ?
                        <Label basic color='red' pointing>
                            {t('form.create.form-title.missing')}
                        </Label> : null}
                </Form.Field>
                <Form.Field>
                    <Form.Input name="formName" fluid label={t('form.create.form-name.label')}  placeholder={t('form.create.form-name.placeholder')} type='text'
                                error={form.missing.formName}
                                onChange={(e) => updateField(e.target.name, e.target.value)} value={form.formName}/>
                    {form.missing.formName ?
                        <Label basic color='red' pointing>
                            {t('form.create.form-name.missing')}
                        </Label> : null}
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <Form.Input name="path" label={t('form.create.form-path.label')} placeholder={t('form.create.form-path.placeholder')} type='text'
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                                error={form.missing.path} value={form.path}/>
                    {form.missing.path ?
                        <Label basic color='red' pointing>
                            {t('form.create.form-path.missing')}
                        </Label> : null}

                </Form.Field>
                <Form.Field>
                    <Form.Dropdown label={t('form.create.form-type.select')}
                                   placeholder={t('form.create.form-type.select-placeholder')}
                                   openOnFocus
                                   selection
                                   clearable
                                   options={formChoices}
                                   onChange={(e, {name, value}) => {
                                       setValues({
                                           ...form,
                                           'display': value
                                       });
                                   }}
                    />
                </Form.Field>
            </Form.Group>
            <Divider clearing/>
            <FormBuilder form={{display: form.display}}  onChange={(jsonSchema) => {
                setValues({
                    ...form,
                    'json': jsonSchema
                });
            }}/>
            <Divider clearing/>
            <PreviewFormModal form={form.json} title={form.title} open={form.displayPreview} onClosePreview={closePreview}/>
            <div style={{paddingTop: '10px'}}>
                <Button.Group size='large'>
                    <Button onClick={() => {
                        backToForms();
                    }}>{t('form.cancel.label')}</Button>
                    <Button.Or/>
                        <Button onClick={() => {
                            openPreview()
                    }} secondary>{t('form.preview.label')}</Button>
                    <Button.Or/>
                    <Button primary
                            disabled={formInvalid()} onClick={makeRequest}
                            loading={status === EXECUTING}>{status === EXECUTING ? t('form.create.creating-label') : t('form.create.label')}</Button>
                </Button.Group></div>
        </Form>
    </div>
};

export default CreateFormBuilder;
