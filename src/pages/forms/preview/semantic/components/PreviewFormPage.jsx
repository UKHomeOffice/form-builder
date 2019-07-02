import React from 'react';
import usePreviewForm from "../usePreviewForm";
import {ERROR, EXECUTING} from "../../../../../core/api/actionTypes";
import {Button, Container, Divider, Grid, Header, Icon, Loader, Message, Tab} from "semantic-ui-react";
import {useTranslation} from 'react-i18next';
import PreviewFormComponent from "../../../common/components/PreviewFormComponent";
import config from 'react-global-configuration';
import useEnvContext from "../../../../../core/context/useEnvContext";
import SchemaModal from "../../../schema/SchemaModal";
import useRoles from "../../../common/useRoles";
import './PreviewFormPage.scss';
import Comments from "../../../comment/components/Comments";

const PreviewFormPage = ({formId}) => {
    const {t} = useTranslation();
    const {status, response, form,
            previewSubmission, backToForms, openSchemaView, closeSchemaView, duplicate, edit, parseCss} = usePreviewForm(formId);
    const {canEdit} = useRoles();
    const {envContext} = useEnvContext();
    if (status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('form.list.failure.forms-load', {error: JSON.stringify(response.data)})}
        </Message>
    }

    const panes = [
        {
            menuItem: {key: 'form', icon: 'wordpress forms', content: 'Form details'},
            render: () => <Tab.Pane loading={!status || status === EXECUTING}>
                <Grid>
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
                    {form.data ? <SchemaModal form={parseCss(form.data)} open={form.openSchemaView}
                                              close={closeSchemaView}/> : null}
                    <Grid.Row>
                        <Grid.Column>
                            <Container>
                                <div className={canEdit() ? 'ui stackable five buttons' : 'ui stackable two buttons'}>
                                    <Button data-cy="backToForms" onClick={() => {
                                        backToForms();
                                    }} default>{t('form.preview.back-to-forms', {env: envContext.id})}</Button>
                                    {canEdit() ? <React.Fragment>
                                        <Button data-cy="viewSchema"
                                                onClick={() => {
                                                    openSchemaView();
                                                }}
                                                secondary>{t('form.schema.view', {env: envContext.id})}
                                        </Button>

                                        <Button data-cy="duplicate"
                                                onClick={() => {
                                                    duplicate()
                                                }}
                                                secondary>{t('form.preview.duplicate', {env: envContext.id})}
                                        </Button>
                                        <Button data-cy="edit"
                                                onClick={() => {
                                                    edit()
                                                }}
                                                primary>{t('form.edit.label-form')}
                                        </Button>

                                    </React.Fragment> : null}
                                    {config.get('gov-uk-enabled', false) ?
                                        <Button data-cy="govUKPreview" onClick={() => {
                                            window.open(`/forms/${envContext.id}/${formId}/preview/gov-uk`)
                                        }} color="teal">{t('form.preview.govuk.open')}</Button> : null}
                                </div>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {form.data ? <PreviewFormComponent form={parseCss(form.data)} submission={form.submission}
                                                               handlePreview={previewSubmission}/> : null}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Tab.Pane>,
        },
        {
            menuItem: {key: 'comments', icon: 'comments outline', content: 'Comments'},
            render: () => <Tab.Pane><Comments formId={formId}/></Tab.Pane>,
        },
        {
            menuItem: {key: 'versions', icon: 'copy outline', content: 'Versions'},
            render: () => <Tab.Pane>Versions</Tab.Pane>,
        }
    ]

    return <Tab panes={panes}/>
};

export default PreviewFormPage;
