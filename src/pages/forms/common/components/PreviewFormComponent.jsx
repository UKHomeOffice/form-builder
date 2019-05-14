import React from 'react';
import {Container, Divider, Header, Icon, Message, Segment} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import useFormDataReplacer from "../../../../core/replacements/useFormDataReplacer";
import ReactJson from "react-json-view";
import {Form, Formio} from 'react-formio';
import "formiojs/dist/formio.full.css";

Formio.Templates.framework = 'semantic';

const PreviewFormComponent = ({form, submission, handlePreview}) => {
    const {t} = useTranslation();
    return <Container>
        <Message icon
                 warning>
            <Icon name='exclamation circle'/>
            <Message.Content>
                <Message.Header>{t('form.preview.submission-warning-title')}</Message.Header>
                {t('form.preview.submission-warning-description')}
            </Message.Content>
        </Message>
        <Divider hidden/>
        <Segment>
            {form ? <Header
                as='h2'
                content={form.title ? form.title : 'No form title'}
                subheader={form.name ? form.name : 'No form name'}
                dividing
            /> : null}
            <PreviewFormPanel form={form} formSubmission={submission} submissionInfoCollapsed={true}
                              previewSubmission={(submission) => {
                                  handlePreview(submission)
                              }}/>
        </Segment>
    </Container>
};


const PreviewFormPanel = ({form, formSubmission, previewSubmission, submissionInfoCollapsed = false}) => {
    const {t} = useTranslation();
    const {parseForm} = useFormDataReplacer();
    if (!form) {
        return null
    }
    return <React.Fragment>
        <Form form={parseForm(form)} onSubmit={(submission) => previewSubmission(submission)}
              options={
                  {
                      noAlerts: true
                  }}/>
        <Divider horizontal>
            <Header as='h4'>
                <Icon name='database'/>
                {t('form.preview.form-submission-label')}
            </Header>
        </Divider>
        <ReactJson src={formSubmission ? formSubmission : {}} theme="monokai" name={null}
                   collapseStringsAfterLength={100}
                   collapsed={submissionInfoCollapsed}/>

    </React.Fragment>
};

export default PreviewFormComponent;





