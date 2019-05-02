import React, {useState} from 'react';
import {FormBuilder, Formio} from 'react-formio';
import {Button, Divider, Form} from 'semantic-ui-react'
import 'formiojs/dist/formio.builder.css';
import {useNavigation} from "react-navi";

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
    const navigation = useNavigation();
    const [type, setType] = useState('form');
    return <div style={{paddingBottom: '10px'}}>
        <Form className='attached fluid segment'>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Title' placeholder='Form title' type='text'/>
                <Form.Input fluid label='Name' placeholder='Form name' type='text'/>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input label='Path' placeholder='Path' type='text'/>
                <Form.Dropdown label='Select form type'
                               openOnFocus
                               selection
                               clearable
                               options={formChoices}
                               onChange={(e, {name, value}) => setType(value)}/>
            </Form.Group>
            <Divider clearing/>
            <FormBuilder form={{display: type}}/>
            <Divider clearing/>
            <div style={{paddingTop: '10px'}}>
                <Button.Group size='large'>
                    <Button onClick={() => {
                        navigation.navigate("/forms");
                    }}>Cancel</Button>
                    <Button.Or/>
                    <Button positive>Create</Button>
                </Button.Group></div>
        </Form>
    </div>
};

export default CreateFormBuilder;
