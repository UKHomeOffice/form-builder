import React from 'react';
import usePreviewForm from "../usePreviewForm";
import {ERROR, EXECUTING} from "../../../../../core/api/actionTypes";
import {Button, Container, Divider, Grid, Header, Icon, Loader, Message} from "semantic-ui-react";
import {useTranslation} from 'react-i18next';
import PreviewFormComponent from "../../../common/components/PreviewFormComponent";
import config from 'react-global-configuration';
import useEnvContext from "../../../../../core/context/useEnvContext";
import SchemaModal from "../../../schema/SchemaModal";

const PreviewFormPage = ({formId}) => {
    const {t} = useTranslation();
    const {status, response, form, previewSubmission, backToForms, openSchemaView, closeSchemaView} = usePreviewForm(formId);
    const {envContext} = useEnvContext();
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
    return <Grid>

        <Grid.Row>
            <Grid.Column>
                <Divider horizontal>
                    <Header as='h3'>
                        <Icon name='eye'/>
                        Preview
                    </Header>
                </Divider>
            </Grid.Column>
        </Grid.Row>
        {form.data ? <SchemaModal form={form.data} open={form.openSchemaView} close={closeSchemaView}/> : null}
        <Grid.Row>
            <Grid.Column>
                <Container><Button data-cy="backToForms" onClick={() => {
                    backToForms();
                }} default>{t('form.preview.back-to-forms', {env: envContext.id})}</Button> <Button data-cy="viewSchema"
                                                                                                    onClick={() => {
                                                                                                        openSchemaView();
                                                                                                    }}
                                                                                                    secondary>{t('form.schema.view', {env: envContext.id})}</Button> {config.get('gov-uk-enabled', false) ?
                    <Button data-cy="govUKPreview" onClick={() => {
                        window.open(`/forms/${envContext.id}/${formId}/preview/gov-uk`)
                    }} color="teal">{t('form.preview.govuk.open')}</Button> : null} </Container>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                {form.data ? <PreviewFormComponent form={form.data} submission={form.submission}
                                                   handlePreview={previewSubmission}/> : null}
            </Grid.Column>
        </Grid.Row>
    </Grid>

};

export default PreviewFormPage;
