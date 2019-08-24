import React from 'react';
import usePreviewForm from "../usePreviewForm";
import {useTranslation} from 'react-i18next';
import PreviewFormComponent from "../../../common/components/PreviewFormComponent";
import config from 'react-global-configuration';
import useEnvContext from "../../../../../core/context/useEnvContext";
import SchemaModal from "../../../schema/SchemaModal";
import useRoles from "../../../common/useRoles";
import './PreviewFormPage.scss';
import Comments from "../../../comment/components/Comments";
import Versions from "../../../versions/components/Versions";
import Tabs from "react-bootstrap/Tabs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faHistory, faInfo} from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";

const PreviewFormPage = ({formId}) => {
    const {t} = useTranslation();
    const {
        status, response, form,
        exception,
        previewSubmission,
        backToForms,
        openSchemaView,
        closeSchemaView,
        duplicate,
        edit,
        parseCss,
        reload,
        setTabKey
    } = usePreviewForm(formId);
    const {canEdit} = useRoles();
    const {envContext} = useEnvContext();
    // if (status === ERROR) {
    //     return <Container><Message negative>
    //         <Message.Header>{t('error.general')}</Message.Header>
    //         {t('form.list.failure.forms-load', {
    //             error: response ? JSON.stringify(response.data)
    //                 : exception.message
    //         })}
    //     </Message></Container>
    // }
    //
    // const panes = [
    //     {
    //         menuItem: {key: 'form', icon: 'wordpress forms', content: 'Form details'},
    //         render: () => <Tab.Pane>
    //             {!status || status === EXECUTING ?
    //                 <div className="center"><Loader active inline='centered'
    //                                                 size='large'>{t('form.loading-form')}</Loader></div> :
    //                 <Grid>
    //                     <Grid.Row>
    //                         <Grid.Column>
    //                             <Divider horizontal>
    //                                 <Header as='h3'>
    //                                     <Icon name='eye'/>
    //                                     Preview
    //                                 </Header>
    //                             </Divider>
    //                         </Grid.Column>
    //                     </Grid.Row>
    //                     {form.data ? <SchemaModal form={parseCss(form.data)} open={form.openSchemaView}
    //                                               close={closeSchemaView}/> : null}
    //                     <Grid.Row>
    //                         <Grid.Column>
    //                             <Container>
    //                                 <div
    //                                     className={canEdit() ? 'ui stackable five buttons' : 'ui stackable two buttons'}>
    //                                     <Button data-cy="backToForms" onClick={() => {
    //                                         backToForms();
    //                                     }} default>{t('form.preview.back-to-forms', {env: envContext.id})}</Button>
    //                                     <React.Fragment>
    //                                         <Button data-cy="viewSchema"
    //                                                 color='grey'
    //                                                 loading={form.openSchemaView}
    //                                                 disabled={form.openSchemaView}
    //                                                 onClick={() => {
    //                                                     openSchemaView();
    //                                                 }}>{t('form.schema.view', {env: envContext.id})}
    //
    //                                         </Button>
    //
    //                                         {canEdit() && envContext.editable ?
    //                                             <React.Fragment><Button data-cy="duplicate"
    //                                                                     onClick={() => {
    //                                                                         duplicate()
    //                                                                     }}
    //                                                                     secondary>{t('form.preview.duplicate', {env: envContext.id})}
    //                                             </Button>
    //                                                 <Button data-cy="edit"
    //                                                         onClick={() => {
    //                                                             edit()
    //                                                         }}
    //                                                         primary>{t('form.edit.label-form')}
    //                                                 </Button> </React.Fragment> : null}
    //
    //                                     </React.Fragment>
    //                                     {config.get('gov-uk-enabled', false) ?
    //                                         <Button data-cy="govUKPreview" onClick={() => {
    //                                             window.open(`/forms/${envContext.id}/${formId}/preview/gov-uk`)
    //                                         }} color="teal">{t('form.preview.govuk.open')}</Button> : null}
    //                                 </div>
    //                             </Container>
    //                         </Grid.Column>
    //                     </Grid.Row>
    //                     <Grid.Row>
    //                         <Grid.Column>
    //                             {form.data ?
    //                                 <PreviewFormComponent form={parseCss(form.data)} submission={form.submission}
    //                                                       handlePreview={previewSubmission}/> : null}
    //                         </Grid.Column>
    //                     </Grid.Row>
    //                 </Grid>
    //             }
    //
    //         </Tab.Pane>,
    //     },
    //     {
    //         menuItem: {key: 'versions', icon: 'copy outline', content: 'Versions'},
    //         render: () => <Tab.Pane><Versions formId={formId}/></Tab.Pane>,
    //     }];
    //
    // if (envContext.editable) {
    //     const last = panes.pop();
    //     panes.push({
    //         menuItem: {key: 'comments', icon: 'comments outline', content: 'Comments'},
    //         render: () => <Tab.Pane><Container><Comments formId={formId}/></Container></Tab.Pane>,
    //     }, last);
    // }
    //

    return <Tabs unmountOnExit={true} mountOnEnter={true} className="mt-3" id="formsPreview" activeKey={form.tabKey}
                 onSelect={(k) => {
                     setTabKey(k);
                     if (k === 'details') {
                         reload();
                     }
                 }}>
        <Tab eventKey="details" title={<React.Fragment><FontAwesomeIcon icon={faInfo}/><span className="m-2">Form details</span></React.Fragment>}>

            {form.data ?
                <div className="mt-2"><PreviewFormComponent form={parseCss(form.data)} submission={form.submission}
                                                            handlePreview={previewSubmission}/></div> : null}
        </Tab>
        <Tab eventKey="history" title={<React.Fragment><FontAwesomeIcon icon={faHistory}/><span
            className="m-2">History</span></React.Fragment>}>
            <Versions formId={formId}/>
        </Tab>
        {envContext.editable ?
            <Tab eventKey="comments" title={<React.Fragment><FontAwesomeIcon icon={faComments}/><span
                className="m-2">Comments</span></React.Fragment>}>
                <Comments formId={formId}/>
            </Tab>
            : null}
    </Tabs>
};

export default PreviewFormPage;
