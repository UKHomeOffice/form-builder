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
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

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
        loadLocalChanges
    } = useEditForm(formId);
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {envContext} = useEnvContext();

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
        <Modal show={editForm.openLocalChangesDetectedModal} onHide={() => closeDraftModal()}>
            <Modal.Header closeButton>
                <Modal.Title>{t('form.edit.unsaved.data.detected-local-changes-title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body><React.Fragment>
                <p>{t('form.edit.unsaved.data.detected-local-changes')}</p>
            </React.Fragment></Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary" onClick={() => closeDraftModal()}>{t('form.edit.unsaved.data.button-cancel')}</Button>
                <Button data-cy="confirm-local"
                        onClick={() => loadLocalChanges()}
                        variant="primary">{t('form.edit.unsaved.data.button-load')}</Button>

            </Modal.Footer>
        </Modal>
        <Overlay active={!status || status === EXECUTING} styleName="mt-5"
                 children=
                     {editForm.data ?
                         <React.Fragment>
                             {editForm.hasUnsavedData ? <Container><Alert variant="warning" className="border-1 mt-2">
                                 <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                                     <span className="ml-2">{t('form.edit.unsaved.data.title')}</span>
                                 </Alert.Heading>
                                 <p>{t('form.edit.unsaved.data.description')}</p>
                             </Alert></Container>: null}
                             <FormBuilderComponent
                                 envContext={envContext}
                                 form={editForm}
                                 updateField={updateField}
                                 updateForm={updateForm}
                                 status={state.status}
                                 formChoices={formChoices}
                                 messageKeyPrefix={"form.edit"}
                                 backToForms={backToForms}
                                 closePreview={closePreview}
                                 openPreview={openPreview}
                                 t={t}
                                 formInvalid={formInvalid}
                                 save={editRequest}
                                 changeDisplay={changeDisplay}
                             />
                         </React.Fragment> : null}

                 loadingText={t('form.loading-form')}/>
        </React.Fragment>




};

export default EditFormPage;
