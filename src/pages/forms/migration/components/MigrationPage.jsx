import React from "react";
import useMigrations from "../useMigrations";
import {
    Button,
    Checkbox,
    Confirm,
    Container,
    Dimmer,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    List,
    Loader,
    Pagination,
    Popup,
} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import {EXECUTING} from "../../../../core/api/actionTypes";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useNavigation} from "react-navi";
import _ from 'lodash';
import {isMobile} from "react-device-detect";

const MigrationPage = () => {
    const {
        loadForms, formio, setFormio, formInValid, status, handlePaginationChange, handleCancelMigration,
        handleConfirmMigration, migrationState, handleTitleSearch
    } = useMigrations();
    const {url, username, password, forms, environment, total, limit, activePage, open, searchTitle} = formio;
    const {t} = useTranslation();
    const {editableEnvironments, clearEnvContext} = useEnvContext();
    const navigation = useNavigation();
    return <Container>
        <Confirm open={open}
                 onCancel={handleCancelMigration}
                 onConfirm={handleConfirmMigration}
                 content={t('migration.confirm-content')}
                 header={t('migration.confirm-header')}
        />
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
                                <Form.Input name="url" label='Source environment' placeholder='Formio URL' width={6}
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
                                <Form.Input name="username" label='Username'
                                            value={username}
                                            error={username === '' || username === null}
                                            placeholder='Service account username'
                                            width={6} onChange={
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
                                            width={6} onChange={
                                    (e, {name, value}) => {
                                        setFormio(formio => ({
                                            ...formio,
                                            [name]: value
                                        }));
                                    }
                                }/>
                            </Form.Group>
                            <Form.Select
                                width={4}
                                fluid
                                value={environment}
                                label='Target environment'
                                error={environment === '' || environment === null}
                                options={editableEnvironments().map((env) => {
                                    return {
                                        key: env.id,
                                        text: env.label,
                                        value: env.id
                                    }
                                })}
                                onChange={
                                    (e, {value}) => {
                                        setFormio(formio => ({
                                            ...formio,
                                            environment: value
                                        }));
                                    }}
                                placeholder='Environment '/>
                            <div>
                                <Button content='Load forms to migrate' primary disabled={
                                    formInValid() || status === EXECUTING
                                } loading={status === EXECUTING}/>
                                <Button secondary onClick={() => {
                                    clearEnvContext();
                                    navigation.navigate("/");
                                }}>{t('form.cancel.label')}</Button>
                            </div>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Input data-cy="search-title" icon='search'
                               name="search-title"
                               placeholder={t('form.list.search-label')}
                               size='large'
                               value={searchTitle}
                               disabled={formInValid()}
                               onChange={handleTitleSearch}
                               fluid focus/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {status === EXECUTING ?
                            <Loader active inline='centered' size='medium'>{t('form.list.loading')}</Loader> :
                            <Dimmer.Dimmable dimmed={migrationState.status === EXECUTING}>
                                <Dimmer active={migrationState.status === EXECUTING} inverted>
                                    <Loader active inline='centered'
                                            size='medium'>{t('migration.migrating-label')}</Loader>
                                </Dimmer>
                                <List divided verticalAlign='middle'>
                                    {
                                        forms.map((form) => {
                                            let checked = false;
                                            if (formio.formsIdsForMigration.length !== 0) {
                                                if (_.find(formio.formsIdsForMigration, (id) => {
                                                    return id === form._id;
                                                })) {
                                                    checked = true;
                                                }
                                            }

                                            return <List.Item key={form._id}>
                                                <List.Content floated='right'>
                                                    {!form.exists ?
                                                        <Checkbox toggle
                                                                  value={form._id}
                                                                  defaultChecked={checked}
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
                            </Dimmer.Dimmable>
                        }
                        {forms.length !== 0 ? <div style={{marginTop: '20px', textAlign: 'center'}}><Pagination
                            disabled={total < limit}
                            totalPages={Math.ceil(parseInt(total) / limit)}
                            activePage={activePage}
                            ellipsisItem={isMobile ? null : {
                                content: <Icon name='ellipsis horizontal'/>,
                                icon: true
                            }}
                            firstItem={isMobile ? null : {
                                content: <Icon name='angle double left'/>,
                                icon: true
                            }}
                            lastItem={isMobile ? null : {
                                content: <Icon name='angle double right'/>,
                                icon: true
                            }}
                            prevItem={{content: <Icon name='angle left'/>, icon: true}}
                            nextItem={{content: <Icon name='angle right'/>, icon: true}}
                            onPageChange={handlePaginationChange}/></div> : null}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {formio.formsIdsForMigration.length !== 0 ? <div><Button
                            onClick={() => {
                                setFormio(formio => ({
                                    ...formio,
                                    open: true
                                }));
                            }}
                            loading={migrationState.status === EXECUTING}
                            disabled={migrationState.status === EXECUTING}
                            primary>{t('migration.migration-action-label', {env: environment})}</Button>
                            <Button secondary onClick={() => {
                                clearEnvContext()
                                navigation.navigate("/");
                            }}>{t('form.cancel.label')}</Button></div> : null}

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    </Container>
};

export default MigrationPage;