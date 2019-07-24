import React from "react";
import useMigrations from "../useMigrations";
import {Button, Checkbox, Container, Form, Grid, Header, Icon, Label, List, Popup} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import {EXECUTING} from "../../../../core/api/actionTypes";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useNavigation} from "react-navi";
import _ from 'lodash';

const MigrationPage = () => {
    const {loadForms, formio, setFormio, formInValid, status} = useMigrations();
    const {url, username, password, forms, environment} = formio;
    const {t} = useTranslation();
    const {editableEnvironments, changeContextById, clearEnvContext} = useEnvContext();
    const navigation = useNavigation();
    return <Container>
        <div style={{paddingTop: '20px'}}>
            <div style={{textAlign: 'center'}}>
                <Header as='h2' icon>
                    <Icon name='move'/>
                    {t('migration.title')}
                    <Header.Subheader> {t('migration.description')}</Header.Subheader>
                </Header>
            </div>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column>
                        <Form onSubmit={loadForms}>
                            <Form.Group>
                                <Form.Input name="url" label='Source environment' placeholder='Formio URL' width={4}
                                            onChange={
                                                (e, {name, value}) => {
                                                    setFormio(formio => ({
                                                        ...formio,
                                                        [name]: value
                                                    }));
                                                }
                                            }
                                            error={url === '' || url === null}
                                            value={url}
                                />
                                <Form.Select
                                    width={4}
                                    fluid
                                    value={environment}
                                    label='Target environment'
                                    options={editableEnvironments().map((env) => {
                                        return {
                                            key: env.id,
                                            text: env.label,
                                            value: env.id
                                        }
                                    })}
                                    onChange={
                                        (e, {value}) => {
                                            changeContextById(value);
                                            setFormio(formio => ({
                                                ...formio,
                                                environment: value
                                            }));
                                        }}
                                    placeholder='Environment '/>

                                <Form.Input name="username" label='Username'
                                            value={username}
                                            error={username === '' || username === null}
                                            placeholder='Service account username'
                                            width={4} onChange={
                                    (e, {name, value}) => {
                                        setFormio(formio => ({
                                            ...formio,
                                            [name]: value
                                        }));
                                    }
                                }/>
                                <Form.Input name="password" label='Password'
                                            type="password"
                                            placeholder='Service account password'
                                            value={password}
                                            error={password === '' || password === null}
                                            width={4} onChange={
                                    (e, {name, value}) => {
                                        setFormio(formio => ({
                                            ...formio,
                                            [name]: value
                                        }));
                                    }
                                }/>
                            </Form.Group>
                            <div>
                                <Button content='Load forms to migrate' primary disabled={
                                    formInValid() || status === EXECUTING
                                } loading={status === EXECUTING}/>
                                <Button secondary onClick={() => {
                                    clearEnvContext()
                                    navigation.navigate("/");
                                }}>{t('form.cancel.label')}</Button>
                            </div>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List divided verticalAlign='middle'>
                            {
                                forms.map((form) => {
                                    return <List.Item key={form._id}>
                                        <List.Content floated='right'>
                                            {!form.exists ?
                                                <Checkbox label={t('migration.migration-button-label')} toggle
                                                          value={form._id}
                                                          onChange={(event, data) => {
                                                              if (data.checked) {
                                                                  formio.formsIdsForMigration.push(data.value);
                                                              } else {
                                                                 _.remove(formio.formsIdsForMigration, (id) => {
                                                                     return id === data.value;
                                                                 })
                                                              }
                                                              setFormio(formio => ({
                                                                  ...formio
                                                              }));
                                                          }}
                                                />
                                                : <Popup content={`${form.name} has already been migrated`}
                                                         trigger={<Label color='teal' as='a'>Migrated</Label>}
                                                         on='hover'
                                                         basic
                                                />}
                                        </List.Content>
                                        <List.Content>{form.title}</List.Content>
                                    </List.Item>
                                })
                            }
                        </List>

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                            {formio.formsIdsForMigration.length !== 0 ?  <div><Button
                                primary>{t('migration.migration-action-label', {env: environment})}</Button>
                            <Button secondary onClick={() => {
                                clearEnvContext()
                                navigation.navigate("/");
                            }}>{t('form.cancel.label')}</Button> </div>: null}

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    </Container>
};

export default MigrationPage;
