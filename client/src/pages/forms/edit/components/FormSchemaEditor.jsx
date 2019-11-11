import React from 'react';
import Container from "react-bootstrap/Container";
import useEditForm from "../useEditForm";
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useKeycloak} from "react-keycloak";
import useBeforeUnload from "use-before-unload";
import jwt_decode from "jwt-decode";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {EXECUTING} from "../../../../core/api/actionTypes";
import ConfirmLoadLocalChangesModal from "../../localchanges/components/ConfirmLoadLocalChangesModal";
import Overlay from "../../../../common/Overlay";
import FormJsonSchemaEditor from "./FormJsonSchemaEditor";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import PreviewFormModal from "../../create/components/PreviewFormModal";
import Form from "react-bootstrap/Form";

const FormSchemaEditor = ({formId}) => {
    const {
        status,
        editForm,
        updateJSON,
        backToForms,
        openPreview,
        formInvalid,
        editRequest,
        closeDraftModal,
        closePreview,
        loadLocalChanges,
        formBuilderEditView,
        changeJSONEditorMode
    } = useEditForm(formId);
    const {t} = useTranslation();
    const {envContext} = useEnvContext();
    const {keycloak} = useKeycloak();


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
    const messageKeyPrefix = 'form.edit';

    return <React.Fragment>

        <ConfirmLoadLocalChangesModal
            loadLocalChanges={loadLocalChanges}
            openLocalChangesDetectedModal={editForm.openLocalChangesDetectedModal}
            closeConfirmLoadLocalChangesModal={closeDraftModal}/>

        <PreviewFormModal form={editForm.data} title={editForm.title} open={editForm.displayPreview}
                          onClosePreview={closePreview}/>

        <Container><Alert variant="warning" className="border-1 mt-2">
            <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                <span className="ml-2">{t('form.schema.edit.advanced-usage')}</span>
            </Alert.Heading>
        </Alert></Container>

        <Overlay active={(!status || status === EXECUTING) || editForm.reloadingFromLocal} styleName="mt-5"
                 children={
                     <React.Fragment>
                         <Container>
                             <Row>
                                 <Col>{editForm.hasUnsavedData ? <Alert variant="warning" className="border-1 mt-2">
                                     <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                                         <span className="ml-2">{t('form.edit.unsaved.data.title')}</span>
                                     </Alert.Heading>
                                     <p>{t('form.edit.unsaved.data.description')}</p>
                                 </Alert> : null}</Col>
                             </Row>
                             <Row>
                                 <Col>
                                     <hr className="hr-text" data-content={t('form.schema.label')}/>
                                 </Col>
                             </Row>
                             <Row className="mb-2">
                                 <Col>
                                     <Form.Label
                                         className="font-weight-bold">Select JSON editor mode</Form.Label>

                                     <Form.Control as="select"
                                                   data-cy="jsonEditorType"
                                                   value={editForm.jsonEditorMode}
                                                   onChange={(e) => {
                                                       changeJSONEditorMode(e.target.value)
                                                   }}>
                                                <option value="tree" selected={editForm.jsonEditorMode === 'tree'}>Tree</option>
                                                <option value="code"  selected={editForm.jsonEditorMode === 'code'}>Code</option>
                                                <option value="text"  selected={editForm.jsonEditorMode === 'text'}>Text</option>

                                     </Form.Control>
                                 </Col>
                             </Row>
                             <Row>
                                 <Col>
                                     <FormJsonSchemaEditor
                                         onChangeJSON={(json) => updateJSON(json)}
                                         json={editForm.data}
                                         mode={editForm.jsonEditorMode}
                                         indentation={2}
                                     />
                                 </Col>
                             </Row>
                             <Row>
                                 <Col>
                                     <hr className="hr-text" data-content={t('form.create.actions')}/>
                                 </Col>
                             </Row>
                             <Row>
                                 <Col>
                                     <ButtonToolbar>
                                         <Button data-cy="cancel-edit-form"
                                                 variant="secondary"
                                                 className="mr-2"
                                                 onClick={() => backToForms()}>{t('form.cancel.label')}</Button>
                                         <Button data-cy="edit-form"
                                                 variant="info"
                                                 className="mr-2"
                                                 onClick={async () => formBuilderEditView()}>{t('form.edit.label-formbuilder')}</Button>
                                         <Button data-cy="preview-form"
                                                 variant="dark"
                                                 className="mr-2"
                                                 onClick={() => openPreview()}>{t('form.preview.label')}</Button>
                                         <Button data-cy="persist-form"
                                                 variant="primary"
                                                 disabled={formInvalid()}
                                                 onClick={() => editRequest()}>{status === EXECUTING ? t(`${messageKeyPrefix}.updating-label`) : t(`${messageKeyPrefix}.update-label`)}</Button>

                                     </ButtonToolbar>

                                 </Col>
                             </Row>
                         </Container>
                     </React.Fragment>}

                 loadingText={t('form.loading-form')}/>
    </React.Fragment>
};

export default FormSchemaEditor;
