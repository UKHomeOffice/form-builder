import React from 'react';
import {FormBuilder, Formio} from 'react-formio';
import {Button, Divider, Form, Icon, Label, Message} from 'semantic-ui-react'
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import useCreateForm from "../useCreateForm";
import './CreateFormBuilder.scss';

Formio.Templates.framework = 'semantic';


const formChoices = [{
    key: 'form',
    text: 'Form',
    value: 'form'
}, {
    key: 'wizard',
    text: 'Wizard',
    value: 'wizard'
}];

const CreateFormBuilder = () => {

    const {
        backToForms,
        status,
        response,
        makeRequest,
        formInvalid,
        form,
        setValues,
        updateField,
    } = useCreateForm();


    return <div style={{paddingBottom: '10px'}}>
        {status === ERROR ? <Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>Error</Message.Header>
                {`Failed to create form due to ${JSON.stringify(response.data)}`}
            </Message.Content>
        </Message> : null}
        <Form className='attached fluid segment'>
            <Form.Group widths='equal'>
                <Form.Field>
                    <Form.Input name="title" fluid label='Title' placeholder='Form title' type='text'
                                error={form.missing.title}
                                onChange={(e) => {
                                    updateField(e.target.name, e.target.value);
                                }}/>
                    {form.missing.title ?
                        <Label basic color='red' pointing>
                            Title is required for creating a form
                        </Label> : null}
                </Form.Field>
                <Form.Field>
                    <Form.Input name="formName" fluid label='Name' placeholder='Form name' type='text'
                                error={form.missing.formName}
                                onChange={(e) => updateField(e.target.name, e.target.value)} value={form.formName}/>
                    {form.missing.formName ?
                        <Label basic color='red' pointing>
                            Name is required for creating a form
                        </Label> : null}
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <Form.Input name="path" label='Path' placeholder='Path' type='text'
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                                error={form.missing.path} value={form.path}/>
                    {form.missing.path ?
                        <Label basic color='red' pointing>
                            Path is required for creating a form
                        </Label> : null}

                </Form.Field>
                <Form.Field>
                    <Form.Dropdown label='Select form type'
                                   placeholder='Form type'
                                   openOnFocus
                                   selection
                                   clearable
                                   options={formChoices}
                                   onChange={(e, {name, value}) => {
                                       setValues({
                                           ...form,
                                           'display': value
                                       });
                                   }}
                    />
                </Form.Field>
            </Form.Group>
            <Divider clearing/>
            <FormBuilder form={{display: form.display}} onChange={(jsonSchema) => {
                setValues({
                    ...form,
                    'json': jsonSchema
                });
            }}/>
            <Divider clearing/>
            <div style={{paddingTop: '10px'}}>
                <Button.Group size='large'>
                    <Button onClick={() => {
                        backToForms();
                    }}>Cancel</Button>
                    <Button.Or/>
                    <Button onClick={() => {

                    }} secondary>Preview</Button>
                    <Button.Or/>
                    <Button primary
                            disabled={formInvalid()} onClick={makeRequest}
                            loading={status === EXECUTING}>{status === EXECUTING ? 'Creating...' : 'Create'}</Button>
                </Button.Group></div>
        </Form>
    </div>
};

export default CreateFormBuilder;
