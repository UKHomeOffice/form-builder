import React from 'react';
import {useTranslation} from "react-i18next";
import useCommonFormUtils from "../../common/useCommonFormUtils";
import useCreateForm from "../useCreateForm";
import FormBuilderComponent from "../../common/components/FormBuilderComponent";
import useEnvContext from "../../../../core/context/useEnvContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Overlay from "../../../../common/Overlay";
import {useBeforeunload} from "react-beforeunload";
import ConfirmLoadLocalChangesModal from "../../localchanges/components/ConfirmLoadLocalChangesModal";

const CreateFormFileUpload = ({formContent}) => {
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {
        backToForms,
        status,
        makeRequest,
        formInvalid,
        form,
        updateSchema,
        updateField,
        changeDisplay,
        openPreview,
        closePreview,
        closeDraftModal,
        loadLocalChanges
    } = useCreateForm(formContent);
    const {envContext} = useEnvContext();
    useBeforeunload(() => "You will lose data if you have made updates");

    return <Container>

        <ConfirmLoadLocalChangesModal
            loadLocalChanges={loadLocalChanges}
            openLocalChangesDetectedModal={form.openLocalChangesDetectedModal}
            closeConfirmLoadLocalChangesModal={closeDraftModal}/>

        {form.hasUnsavedData ? <Container><Alert variant="warning" className="border-1 mt-2">
            <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                <span className="ml-2">{t('form.create.unsaved.data.title')}</span>
            </Alert.Heading>
            <p>{t('form.create.unsaved.data.description')}</p>
        </Alert></Container> : null}
        <Overlay active={form.reloadingFromLocal} loadingText={"Loading local changes"}
                 children={
                     <FormBuilderComponent
                         form={form}
                         t={t}
                         envContext={envContext}
                         updateField={updateField}
                         openPreview={openPreview}
                         closePreview={closePreview}
                         status={status}
                         save={makeRequest}
                         changeDisplay={changeDisplay}
                         formChoices={formChoices}
                         messageKeyPrefix={"form.create"}
                         backToForms={backToForms}
                         formInvalid={formInvalid}
                         updateForm={updateSchema}

                     />}/>
    </Container>
};

export default CreateFormFileUpload;
