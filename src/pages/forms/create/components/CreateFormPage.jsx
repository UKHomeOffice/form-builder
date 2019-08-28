import React from 'react';
import useCreateForm from "../useCreateForm";
import {useTranslation} from "react-i18next";
import useCommonFormUtils from "../../common/useCommonFormUtils";
import FormBuilderComponent from "../../common/components/FormBuilderComponent";
import useEnvContext from "../../../../core/context/useEnvContext";
import Alert from "react-bootstrap/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";


const CreateFormPage = () => {
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {
        backToForms,
        status,
        makeRequest,
        formInvalid,
        form,
        updateField,
        openPreview,
        closePreview,
        changeDisplay,
        updateSchema,
    } = useCreateForm();

    const {envContext} = useEnvContext();
    return <div className="mt-3">
        {form.hasUnsavedData ? <Container><Alert variant="warning" className="border-1 mt-2">
            <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                <span className="ml-2">{t('form.create.unsaved.data.title')}</span>
            </Alert.Heading>
            <p>{t('form.create.unsaved.data.description')}</p>
        </Alert></Container>: null}
        <FormBuilderComponent
            form={form}
            t={t}
            envContext={envContext}
            updateField={updateField}
            openPreview={openPreview}
            closePreview={closePreview}
            status={status}
            save={makeRequest}
            formChoices={formChoices}
            messageKeyPrefix={"form.create"}
            backToForms={backToForms}
            formInvalid={formInvalid}
            changeDisplay={changeDisplay}
            updateForm={(jsonSchema) => {
                updateSchema(jsonSchema);
            }}
        />
    </div>
};

export default CreateFormPage;
