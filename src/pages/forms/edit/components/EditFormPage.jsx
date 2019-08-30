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
import {useBeforeunload} from 'react-beforeunload';
import ConfirmLoadLocalChangesModal from "../../localchanges/components/ConfirmLoadLocalChangesModal";

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
    useBeforeunload(() => "You will lose data if you have made updates");

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

        <Overlay active={(!status || status === EXECUTING) || editForm.reloadingFromLocal} styleName="mt-5"
                 children=
                     {editForm.data ?
                         <React.Fragment>
                             {editForm.hasUnsavedData ? <Container><Alert variant="warning" className="border-1 mt-2">
                                 <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                                     <span className="ml-2">{t('form.edit.unsaved.data.title')}</span>
                                 </Alert.Heading>
                                 <p>{t('form.edit.unsaved.data.description')}</p>
                             </Alert></Container> : null}
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
