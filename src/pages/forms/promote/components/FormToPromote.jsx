import React from 'react';
import {Button, Container, Grid, Header, Icon} from "semantic-ui-react";
import {Form, Formio} from 'react-formio';
import "formiojs/dist/formio.full.css";
import {useTranslation} from "react-i18next";

const FormToPromote = ({form, setValue, backToForms}) => {
    const {t} = useTranslation();
    if (!form.data) {
        return null;
    }
    return <React.Fragment>
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column>

                        <Header
                            as='h2'
                            content={form.data.title}
                            subheader={form.data.name}
                            dividing
                        />
                        <Form form={form.data} options={{
                            readOnly: true
                        }}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>

                    <Grid.Column textAlign="right">
                        <div className={'ui stackable two buttons'}>
                        <Button size='large' onClick={() => {
                            backToForms()
                        }} content={t('form.cancel.label')}/>
                        <Button primary size='large' icon labelPosition='right' onClick={() => {
                            setValue(form => ({
                                ...form,
                                step: "environment"
                            }))
                        }}>
                            {t('form.promote.next')}
                            <Icon name='right arrow'/>
                        </Button>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    </React.Fragment>
};

export default FormToPromote;
