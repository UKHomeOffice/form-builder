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

const CreateFormFileUpload = ({formContent}) => {
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {
        backToForms,
        status,
        makeRequest,
        formInvalid,
        form,
        setValues,
        updateField,
        openPreview,
        closePreview
    } = useCreateForm(formContent);
    const {envContext} = useEnvContext();

    if (!formContent) {
        return <Container>
            <Alert variant="warning" className="border-1 mt-2">
                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                    <span className="ml-2">{t('error.general')}</span>
                </Alert.Heading>
                <p className="lead">{t('form.create.file-upload.no-form-content')}</p>
            </Alert>
        </Container>
    }
    return <Container>
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
            updateForm={(jsonSchema) =>
                setValues({
                    ...form,
                    data: Object.assign(jsonSchema, form.data)
                })
            }
        />
    </Container>
};

export default CreateFormFileUpload;
