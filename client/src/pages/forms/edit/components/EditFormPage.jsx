import React from 'react';
import useEditForm from "../useEditForm";
import {EXECUTING} from "../../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import useCommonFormUtils from "../../common/useCommonFormUtils";
import FormBuilderComponent from "../../common/components/FormBuilderComponent";
import useEnvContext from "../../../../core/context/useEnvContext";
import Container from "react-bootstrap/Container";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import Overlay from "../../../../common/Overlay";
import ConfirmLoadLocalChangesModal from "../../localchanges/components/ConfirmLoadLocalChangesModal";
import useBeforeUnload from 'use-before-unload';
import {useKeycloak} from "react-keycloak";
import jwt_decode from "jwt-decode";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Button} from "react-bootstrap";
import {useNavigation} from "react-navi";


const EditFormPage = ({formId}) => {
    const {
        status,
        editForm,
        updateField,
        updateForm,
        backToForms,
        closePreview,
        openPreview,
        formInvalid,
        editRequest,
        state,
        changeDisplay,
        closeDraftModal,
        loadLocalChanges,
        updateJSON,
        changeSchemaView,
        changeJSONEditorMode
    } = useEditForm(formId);
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {envContext} = useEnvContext();
    const {keycloak} = useKeycloak();
    const navigation = useNavigation();


    useBeforeUnload(evt => {
        const isExpired = jwt_decode(keycloak.refreshToken).exp < new Date().getTime() / 1000;
        return !isExpired;
    });

    if (!envContext.editable) {

        return <Container>
            <Alert variant="warning" className="border-1 mt-2">
                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                    <span className="ml-2">{t('error.general')}</span>
                </Alert.Heading>
                <p className="lead">{t('form.edit.failure.non-editable-environment')}</p>
            </Alert>
        </Container>

    }
    return <React.Fragment>

        <ConfirmLoadLocalChangesModal
            loadLocalChanges={loadLocalChanges}
            openLocalChangesDetectedModal={editForm.openLocalChangesDetectedModal}
            closeConfirmLoadLocalChangesModal={closeDraftModal}/>
        <Container>
            <Row>
                <Col>
                    <Button variant="outline-secondary" onClick={async () => {
                        await navigation.navigate(`/forms/${envContext.id}`, {replace: true});
                    }}>Back to forms in {envContext.label}</Button>
                </Col>
            </Row>
        </Container>
        <Overlay active={(!status || status === EXECUTING) || editForm.reloadingFromLocal} styleName="mt-5"
                 children={
                     <React.Fragment>
                         {editForm.hasUnsavedData ? <Container><Alert variant="warning" className="border-1 mt-2">
                             <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                                 <span className="ml-2">{t('form.edit.unsaved.data.title')}</span>
                             </Alert.Heading>
                             <p>{t('form.edit.unsaved.data.description')}</p>
                         </Alert></Container> : null}
                          <FormBuilderComponent
                             changeSchemaView={changeSchemaView}
                             changeJSONEditorMode={changeJSONEditorMode}
                             openInSchemaEditorMode={editForm.openInSchemaEditorMode}
                             envContext={envContext}
                             onRawJSONUpdate={updateJSON}
                             form={editForm}
                             updateField={updateField}
                             updateForm={updateForm}
                             status={state.status}
                             formChoices={formChoices}
                             messageKeyPrefix={"form.edit"}
                             backToForms={backToForms}
                             closePreview={closePreview}
                             openPreview={openPreview}
                             formInvalid={formInvalid}
                             save={editRequest}
                             changeDisplay={changeDisplay}
                         />
                     </React.Fragment>}

                 loadingText={t('form.loading-form')}/>
    </React.Fragment>


};

export default EditFormPage;
