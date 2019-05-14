import React from 'react';
import {Container, Divider, Header, Icon, Loader, Message} from "semantic-ui-react";
import useEditForm from "../useEditForm";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import useCommonFormUtils from "../../common/useCommonFormUtils";
import FormBuilderComponent from "../../common/components/FormBuilderComponent";

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
        saveRequest,
        state
    } = useEditForm(formId);
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();

    if (!status || status === EXECUTING) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('form.loading-form')}</Loader></div>
    }

    if (status === ERROR) {
        return <Container><Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>{t('error.general')}</Message.Header>
                {t('form.edit.failure.form-load', {error: response ? JSON.stringify(response.data) : t('form.edit.failure.unknown-error')})}
            </Message.Content>
        </Message></Container>
    }

    return <div style={{paddingBottom: '10px'}}>
        <Divider horizontal>
            <Header as='h4'>
                <Icon name='edit'/>
                Edit
            </Header>
        </Divider>
        {editForm.data ? <FormBuilderComponent
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
            save={saveRequest}
        /> : null}
    </div>
};

export default EditFormPage;
