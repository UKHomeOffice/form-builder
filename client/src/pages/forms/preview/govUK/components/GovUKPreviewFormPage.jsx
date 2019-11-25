import React from 'react';
import {ERROR, EXECUTING} from "../../../../../core/api/actionTypes";
import {useTranslation} from 'react-i18next';
import {PreviewFormPanel} from "../../../common/components/PreviewFormComponent";
import "./GovUKPreviewFormPage.scss";
import config from 'react-global-configuration'
import useGDSPreviewForm from "../useGDSPreviewForm";
import Container from "react-bootstrap/Container";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import ErrorSummary from "./ErrorSummary";


const GovUKPreviewFormPage = ({formId}) => {
    document.body.className = 'js-enabled';
    const {t} = useTranslation();
    const {status, response, form, previewSubmission, handleEditorModeViewChange} = useGDSPreviewForm(formId);

    if (!config.get('gov-uk-enabled', false)) {
        return <Container>
            <Alert variant="warning">
                <Alert.Heading><FontAwesomeIcon icon={faExclamationTriangle}/><span
                    className="m-2">{t('error.general')}</span></Alert.Heading>
                <p className="lead">{t('form.preview.failure.gov-uk-not-configured')}</p>
            </Alert>
        </Container>
    }


    return <React.Fragment>
        <hr className="hr-text" data-content={t('form.preview.govuk.header')}/>
        <ErrorSummary/>
        {!status || status === EXECUTING ? <div className="center-context">
            <Spinner animation="border" role="status"/>
            </div> : (status === ERROR ? <Container>
            <Alert variant="danger">
                <Alert.Heading><FontAwesomeIcon icon={faExclamationTriangle}/><span
                    className="m-2">{t('error.general')}</span></Alert.Heading>
                <p className="lead">{t('form.list.failure.forms-load', {error: JSON.stringify(response.data)})}</p>
            </Alert>
        </Container> : <Container>{form.data ? <PreviewFormPanel form={form.data} formSubmission={form.submission}
                                                                 mode={form.jsonEditorMode}
                                                                 handleEditorModeViewChange={handleEditorModeViewChange}
                                                                 previewSubmission={previewSubmission}/> : null}</Container>)}
    </React.Fragment>
};

export default GovUKPreviewFormPage;
