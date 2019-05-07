import React from 'react';
import './PreviewForm.scss';
import usePreviewForm from "../usePreviewForm";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {Divider, Header, Icon, Message, Segment} from "semantic-ui-react";
import {Form, Formio} from 'react-formio';
import ReactJson from 'react-json-view'

Formio.Templates.framework = 'semantic';

const PreviewForm = ({formId}) => {
    const {status, response, form, backToForms, previewSubmission} = usePreviewForm(formId);

    if (status === ERROR) {
        return <Message negative>
            <Message.Header>An error occurred</Message.Header>
            {JSON.stringify(response.data)}
        </Message>
    }
    return <React.Fragment>
        <Message icon
            warning>
            <Icon name='exclamation circle' />
            <Message.Content>
                <Message.Header>Submission is not persisted</Message.Header>
                Data submitted is held in the context of this page and lost when you navigate away from this preview page.
            </Message.Content>
        </Message>
        <Segment basic loading={!status || status === EXECUTING}>
            {form.data ? <Header
                as='h2'
                content={form.data.title}
                subheader={form.data.name}
                dividing
            /> : null}

            <Form form={form.data} onSubmit={(submission) => previewSubmission(submission)} options={{
                noAlerts: true
            }}/>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='database'/>
                    Form submission
                </Header>
            </Divider>
            <ReactJson src={form.submission ? form.submission : {}} theme="monokai" name={null}/>
        </Segment>
    </React.Fragment>
};

export default PreviewForm;
