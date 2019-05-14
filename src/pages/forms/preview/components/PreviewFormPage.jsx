import React from 'react';
import usePreviewForm from "../usePreviewForm";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {Divider, Header, Icon, Loader, Message} from "semantic-ui-react";
import {useTranslation} from 'react-i18next';
import PreviewFormComponent from "../../common/components/PreviewFormComponent";

const PreviewFormPage = ({formId}) => {

    const {t} = useTranslation();
    const {status, response, form, previewSubmission} = usePreviewForm(formId);
    if (!status || status === EXECUTING) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('form.loading-form')}</Loader></div>
    }
    if (status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('form.list.failure.forms-load', {error: JSON.stringify(response.data)})}
        </Message>
    }
    return <React.Fragment>
        <Divider horizontal>
            <Header as='h3'>
                <Icon name='eye'/>
                Preview
            </Header>
        </Divider>
        {form.data ? <PreviewFormComponent form={form.data} submission={form.submission} handlePreview={previewSubmission}/> : null}
    </React.Fragment>
};

export default PreviewFormPage;
