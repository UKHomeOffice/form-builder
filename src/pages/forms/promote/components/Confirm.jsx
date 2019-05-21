import React from 'react';
import {Button, Container, Divider, Grid, Header, Icon, Label, Table} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import _ from 'lodash';

const Confirm = ({form, setValue, backToForms, promote}) => {
    const {t} = useTranslation();
    const {getEnvDetails} = useEnvContext();
    if (!form.data) {
        return null;
    }

    const environment = getEnvDetails(form.environment);
    return <React.Fragment>
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Container>
                        <Divider horizontal>
                            <Header as='h4'>
                                {t('form.promote.confirm')}
                            </Header>
                        </Divider>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Title</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Path</Table.HeaderCell>
                                    <Table.HeaderCell>Environment</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Label color="red" ribbon>{form.data.title}</Label>
                                    </Table.Cell>
                                    <Table.Cell>{form.data.name}</Table.Cell>
                                    <Table.Cell>{form.data.path}</Table.Cell>
                                    <Table.Cell>
                                        <Label color={environment.editable ? 'teal' : 'red'}>
                                            {_.capitalize(environment.label)}
                                        </Label>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>

                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4'>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Container>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column textAlign="right">
                    <Button size='large' secondary icon labelPosition='left' onClick={() => {
                        setValue(form => ({
                            ...form,
                            step: "environment"
                        }));
                    }}>
                        <Icon name='left arrow'/>
                        {t('form.promote.previous')}

                    </Button>
                    <Button size='large' onClick={() => {
                        backToForms()
                    }}>
                        {t('form.cancel.label')}
                    </Button>
                    <Button size='large' positive onClick={() => {
                        promote();
                    }}>
                        {t('form.promote.promote-action')}
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </React.Fragment>;
};

export default Confirm;
