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

const EditFormPage = ({formId}) => {
    const {
        status,
        response,
        editForm,
        updateField,
        updateForm,
        backToForms,
        closePreview,
        openPreview,
        formInvalid,
        editRequest,
        state,
        changeDisplay
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


    return <Overlay active={!status || status === EXECUTING} styleName="mt-5"
                    children=
                        {editForm.data ? <FormBuilderComponent
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
                        /> : null}

                    loadingText={t('form.loading-form')}/>;


};

export default EditFormPage;
