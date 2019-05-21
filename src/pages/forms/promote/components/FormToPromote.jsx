import React from 'react';
import {Button, Container, Grid, Header, Icon} from "semantic-ui-react";
import {Form, Formio} from 'react-formio';
import "formiojs/dist/formio.full.css";
import {Message} from "semantic-ui-react/dist/commonjs/collections/Message";
import {useTranslation} from "react-i18next";

Formio.Templates.framework = 'semantic';

const FormToPromote = ({form, setValue, backToForms}) => {
    const {t} = useTranslation();
    if (!form.data) {
        return null;
    }
    return <React.Fragment>
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Container>
                        <Header
                            as='h2'
                            content={form.data.title}
                            subheader={form.data.name}
                            dividing
                        />
                        <Form form={form.data} options={{
                            readOnly: true
                        }}/> </Container>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column textAlign="right">
                    <Button  size='large' onClick={() => {
                        backToForms()
                    }} content={t('form.cancel.label')} />
                    <Button primary size='large' icon labelPosition='right' onClick={() => {
                        setValue(form => ({
                            ...form,
                            step: "environment"
                        }))}}>
                        {t('form.promote.next')}
                        <Icon name='right arrow'/>
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </React.Fragment>
};

export default FormToPromote;
