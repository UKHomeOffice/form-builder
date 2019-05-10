import React from 'react';
import usePreviewForm from "../usePreviewForm";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {Container, Divider, Header, Icon, Message, Segment} from "semantic-ui-react";
import {useTranslation} from 'react-i18next';
import PreviewFormPanel from "./PreviewFormPanel";

const PreviewFormPage = ({formId}) => {

    const {t} = useTranslation();
    const {status, response, form, previewSubmission} = usePreviewForm(formId);

    if (status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('form.list.failure.forms-load', {error: JSON.stringify(response.data)})}
        </Message>
    }
    return <React.Fragment>
        <Container><Message icon
                 warning>
            <Icon name='exclamation circle'/>
            <Message.Content>
                <Message.Header>{t('form.preview.submission-warning-title')}</Message.Header>
                {t('form.preview.submission-warning-description')}
            </Message.Content>
        </Message>
        <Divider hidden/>
        <Segment basic loading={!status || status === EXECUTING}>
            {form.data ? <Header
                as='h2'
                content={form.data.title}
                subheader={form.data.name}
                dividing
            /> : null}
            <PreviewFormPanel form={form.data} formSubmission={form.submission} previewSubmission={previewSubmission}/>
        </Segment></Container>
    </React.Fragment>
};

export default PreviewFormPage;
