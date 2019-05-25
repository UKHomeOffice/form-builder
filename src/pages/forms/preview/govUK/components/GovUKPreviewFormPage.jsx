import React from 'react';
import {ERROR, EXECUTING} from "../../../../../core/api/actionTypes";
import {Container, Divider, Header, Icon, Loader, Message} from "semantic-ui-react";
import {useTranslation} from 'react-i18next';
import PreviewFormComponent from "../../../common/components/PreviewFormComponent";
import "govuk-frontend/all.scss";
import config from 'react-global-configuration'
import useGDSPreviewForm from "../useGDSPreviewForm";


const GovUKPreviewFormPage = ({formId}) => {

    const {t} = useTranslation();
    const {status, response, form, previewSubmission} = useGDSPreviewForm(formId);

    if (!config.get('gov-uk-enabled', false)) {
        return <Container>
            <Message icon negative>
                <Icon name='exclamation circle'/>
                <Message.Content>
                    <Message.Header>{t('error.general')}</Message.Header>
                    {t('form.preview.failure.gov-uk-not-configured')}
                </Message.Content>
            </Message>
        </Container>
    }

    if (!status || status === EXECUTING) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('form.loading-form')}</Loader>
        </div>
    }
    if (status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('form.list.failure.forms-load', {error: JSON.stringify(response.data)})}
        </Message>
    }
    return <React.Fragment>
        <Divider horizontal>
            <Header as='h3'>
                <Icon name='eye'/>
                {t('form.preview.govuk.header')}
            </Header>
        </Divider>
        {form.data ? <PreviewFormComponent form={form.data} submission={form.submission}
                                           handlePreview={previewSubmission}/> : null}
    </React.Fragment>
};

export default GovUKPreviewFormPage;
