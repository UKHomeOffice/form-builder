import React from 'react';
import {Container, Divider, Header, Icon, Message} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";
import useCommonFormUtils from "../../common/useCommonFormUtils";
import useCreateForm from "../useCreateForm";
import {ERROR} from "../../../../core/api/actionTypes";
import FormBuilderComponent from "../../common/components/FormBuilderComponent";
import useEnvContext from "../../../../core/context/useEnvContext";

const CreateFormFileUpload = ({formContent}) => {
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
        closePreview
    } = useCreateForm(formContent);
    const {envContext} = useEnvContext();
    if (!formContent) {
        return <Container><Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>{t('error.general')}</Message.Header>
                {t('form.create.file-upload.no-form-content')}
            </Message.Content>
        </Message></Container>
    }

    return <div style={{paddingBottom: '10px'}}>
        <Divider horizontal>
            <Header as='h4'>
                <Icon name='add'/>
                Create from existing source
            </Header>
        </Divider>
        <Container>
            {status === ERROR ? <Message icon negative>
                <Icon name='warning circle'/>
                <Message.Content>
                    <Message.Header>{t('error.general')}</Message.Header>
                    {t('form.create.failure.failed-to-create', {error: JSON.stringify(response.data)})}
                </Message.Content>
            </Message> : null}
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
                updateForm={ (jsonSchema) =>
                    setValues({
                        ...form,
                        data: Object.assign(jsonSchema, form.data)
                    })
                }
            />
        </Container>
    </div>
};

export default CreateFormFileUpload;
