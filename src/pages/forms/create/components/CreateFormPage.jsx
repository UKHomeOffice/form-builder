import React from 'react';
import useCreateForm from "../useCreateForm";
import {useTranslation} from "react-i18next";
import useCommonFormUtils from "../../common/useCommonFormUtils";
import FormBuilderComponent from "../../common/components/FormBuilderComponent";
import useEnvContext from "../../../../core/context/useEnvContext";

const CreateFormPage = () => {
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {
        backToForms,
        status,
        response,
        makeRequest,
        formInvalid,
        form,
        setValues,
        updateField,
        openPreview,
        closePreview,
        changeDisplay
    } = useCreateForm();

    const {envContext} = useEnvContext();


    return <div className="mt-3">
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
                form.data.components = jsonSchema.components;
                setValues({
                    ...form
                })
            }}
        />
    </div>
};

export default CreateFormPage;
