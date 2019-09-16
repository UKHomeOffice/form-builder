import React from 'react';
import usePreviewForm from "../usePreviewForm";
import {useTranslation} from 'react-i18next';
import PreviewFormComponent from "../../../common/components/PreviewFormComponent";
import config from 'react-global-configuration';
import useEnvContext from "../../../../../core/context/useEnvContext";
import useRoles from "../../../common/useRoles";
import './PreviewFormPage.scss';
import Comments from "../../../comment/components/Comments";
import Versions from "../../../versions/components/Versions";
import Tabs from "react-bootstrap/Tabs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faHistory, faInfo} from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import {isMobile} from 'react-device-detect';
import SchemaModal from "../../../schema/SchemaModal";

const PreviewFormPage = ({formId}) => {
    const {t} = useTranslation();
    const {
        form,
        previewSubmission,
        backToForms,
        openSchemaView,
        closeSchemaView,
        duplicate,
        edit,
        parseCss,
        setTabKey,
        parseSubmissionSchema,
        closeFormSubmissionSchemaView,
        openFormSubmissionSchemaView
    } = usePreviewForm(formId);
    const {canEdit} = useRoles();
    const {envContext} = useEnvContext();

    return <Container fluid>
        <Row>
            <Col className="d-flex flex-column align-items-center justify-content-center mt-3">
                <ButtonToolbar>
                    <Button block={isMobile} className="mr-2"
                            disabled={form.disableAllActions}
                            data-cy={`backTo${envContext.id}`}
                            onClick={() => {
                                backToForms();
                            }}
                            variant="secondary">{t('form.preview.back-to-forms', {env: envContext.id})}</Button>
                    <Button block={isMobile} variant="info"
                            data-cy="viewSchema"
                            disabled={form.disableAllActions}
                            onClick={() => {
                                openSchemaView();
                            }}
                            className="mr-2">{t('form.schema.view', {env: envContext.id})}</Button>
                    {/*TODO: Will introduce once submission schema generated */}
                    {/*<Button block={isMobile} variant="outline-dark"*/}
                            {/*data-cy="viewFormSubmissionSchema"*/}
                            {/*disabled={form.disableAllActions}*/}
                            {/*onClick={() => {*/}
                                {/*openFormSubmissionSchemaView();*/}
                            {/*}}*/}
                            {/*className="mr-2">{t('form.submission.schema.view', {env: envContext.id})}</Button>*/}

                    {canEdit() && envContext.editable ? <React.Fragment>
                        <Button block={isMobile} variant="dark"
                                data-cy="duplicate"
                                disabled={form.disableAllActions}
                                onClick={() => {
                                    duplicate()
                                }}
                                className="mr-2">{t('form.preview.duplicate', {env: envContext.id})}</Button>
                        <Button block={isMobile} variant="primary"
                                disabled={form.disableAllActions}
                                onClick={() => {
                                    edit()
                                }}
                                className="mr-2">{t('form.edit.label-form')}</Button>
                    </React.Fragment> : null}

                    {config.get('gov-uk-enabled', false) ?
                        <Button block={isMobile} variant="success"
                                disabled={form.disableAllActions}
                                data-cy="govUKPreview"
                                onClick={() => {
                                    window.open(`/forms/${envContext.id}/${formId}/preview/gov-uk`)
                                }}
                                className="mr-2">{t('form.preview.govuk.open')}</Button> : null}
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col>
                <Tabs unmountOnExit={true} mountOnEnter={true} className="mt-3" id="formsPreview"
                      activeKey={form.tabKey}
                      onSelect={(k) => {
                          setTabKey(k);
                      }}>
                    <Tab eventKey="details" title={<React.Fragment><FontAwesomeIcon icon={faInfo}/><span
                        className="m-2">Form details</span></React.Fragment>}>

                        {form.data ?
                            <div className="mt-2"><PreviewFormComponent form={parseCss(form.data)}
                                                                        submission={form.submission}
                                                                        handlePreview={previewSubmission}/>
                            </div> : null}
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
            </Col>
        </Row>
        {form.data ? <SchemaModal form={parseCss(form.data)} open={form.openSchemaView} title={t('form.schema.label')}
                                  close={closeSchemaView}/> : null}

        {form.data ? <SchemaModal form={parseSubmissionSchema(form.data)} open={form.openFormSchemaSubmissionView} title={t('form.submission.schema.label', {formName:form.data.name})}
                                  close={closeFormSubmissionSchemaView}/> : null}

    </Container>


};

export default PreviewFormPage;
