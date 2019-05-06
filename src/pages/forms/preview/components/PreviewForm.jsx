import React from 'react';
import './PreviewForm.scss';
import usePreviewForm from "../usePreviewForm";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {Message, Segment} from "semantic-ui-react";
import {Form, Formio} from 'react-formio';

Formio.Templates.framework = 'semantic';

const PreviewForm = ({formId}) => {
    const {status, response, form, backToForms} = usePreviewForm(formId);

    if (status === ERROR) {
        return  <Message negative>
            <Message.Header>An error occurred</Message.Header>
            {JSON.stringify(response.data)}
        </Message>
    }

    return <Segment basic loading={!status || status === EXECUTING}>
        <Form form={form.data} />
    </Segment>
};

export default PreviewForm;
