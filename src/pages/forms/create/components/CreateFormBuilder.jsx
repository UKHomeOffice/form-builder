import React, {useContext, useEffect, useState} from 'react';
import {FormBuilder, Formio} from 'react-formio';
import {Button, Divider, Form, Icon, Label, Message} from 'semantic-ui-react'
import 'formiojs/dist/formio.builder.css';
import {useNavigation} from "react-navi";
import useApiRequest from "../../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../../core/api/actionTypes";
import {NotificationContext} from "../../../../core/Main";

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
    const [notification,setNotification] = useContext(NotificationContext);
    const navigation = useNavigation();
    const [form, setValues] = useState({
        json: null,
        title: '',
        path: '',
        display: 'form',
        name: '',
        missing: {
            path: false,
            title: false,
            name: false
        }
    });
    const [{status, response}, makeRequest] = useApiRequest(
        `${process.env.REACT_APP_FORMIO_URL}/form`, {
            verb: 'post', params: {}
        }
    );
    const updateField = e => {
        setValues({
            ...form,
            [e.target.name]: e.target.value,
            missing: {
                [e.target.name]: e.target.value === '' || !e.target.value
            }
        });
    };

    useEffect(() => {
        if (status === SUCCESS) {
            setNotification(notification => ({
                notification, header: `${form.title} created`,
                content: `${form.name} has been successfully created`
            }));
            navigation.navigate("/forms");
        }
    }, [status]);

    const formInvalid = () => {
        const {path, title, name, missing} = form;
        return (path === '' || title === '' || name === '')
            || (missing.path || missing.title || missing.name) || status === EXECUTING;
    };

    return <div style={{paddingBottom: '10px'}}>
        {status === ERROR ? <Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>Error</Message.Header>
                {`Failed to create '${form.name}' due to ${JSON.stringify(response.data)}`}
            </Message.Content>
        </Message> : null}
        <Form className='attached fluid segment'>
            <Form.Group widths='equal'>
                <Form.Field>
                    <Form.Input name="title" fluid label='Title' placeholder='Form title' type='text'
                                error={form.missing.title}
                                onChange={updateField}/>
                    {form.missing.title ?
                        <Label basic color='red' pointing>
                            Title is required for creating a form
                        </Label> : null}
                </Form.Field>
                <Form.Field>
                    <Form.Input name="name" fluid label='Name' placeholder='Form name' type='text'
                                error={form.missing.name}
                                onChange={updateField}/>
                    {form.missing.name ?
                        <Label basic color='red' pointing>
                            Name is required for creating a form
                        </Label> : null}
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <Form.Input name="path" label='Path' placeholder='Path' type='text' onChange={updateField}
                                error={form.missing.path}/>
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
                                           ['display']: value
                                       });
                                   }}
                    />
                </Form.Field>
            </Form.Group>
            <Divider clearing/>
            <FormBuilder form={{display: form.display}} onChange={(jsonSchema) => {
                setValues({
                    ...form,
                    ['json']: jsonSchema
                });
            }}/>
            <Divider clearing/>
            <div style={{paddingTop: '10px'}}>
                <Button.Group size='large'>
                    <Button onClick={() => {
                        navigation.navigate("/forms");
                    }}>Cancel</Button>
                    <Button.Or/>
                    <Button onClick={() => {

                    }} secondary>Preview</Button>
                    <Button.Or/>
                    <Button primary
                            disabled={formInvalid()} onClick={makeRequest}
                            loading={status === EXECUTING}>Create</Button>
                </Button.Group></div>
        </Form>
    </div>
};

export default CreateFormBuilder;
