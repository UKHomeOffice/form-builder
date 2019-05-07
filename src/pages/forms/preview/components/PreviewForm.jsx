import React from 'react';
import './PreviewForm.scss';
import usePreviewForm from "../usePreviewForm";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {Divider, Header, Icon, Message, Segment} from "semantic-ui-react";
import {Form, Formio} from 'react-formio';
import ReactJson from 'react-json-view'
import {useTranslation} from 'react-i18next';

Formio.Templates.framework = 'semantic';

const PreviewForm = ({formId}) => {

    const {t, i18n} = useTranslation();
    const {status, response, form, backToForms, previewSubmission} = usePreviewForm(formId);

    if (status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('form.list.failure.forms-load', {error: JSON.stringify(response.data)})}
        </Message>
    }
    return <React.Fragment>
        <Message icon
                 warning>
            <Icon name='exclamation circle'/>
            <Message.Content>
                <Message.Header>{t('form.preview.submission-warning-title')}</Message.Header>
                {t('form.preview.submission-warning-description')}
            </Message.Content>
        </Message>
        <Segment basic loading={!status || status === EXECUTING}>
            {form.data ? <Header
                as='h2'
                content={form.data.title}
                subheader={form.data.name}
                dividing
            /> : null}

            <Form form={form.data} onSubmit={(submission) => previewSubmission(submission)} options={
                {
                    noAlerts: true,
                    i18n: i18n
                }}/>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='database'/>
                    {t('form.preview.form-submission-label')}
                </Header>
            </Divider>
            <ReactJson src={form.submission ? form.submission : {}} theme="monokai" name={null}/>
        </Segment>
    </React.Fragment>
};

export default PreviewForm;
