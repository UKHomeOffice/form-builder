import React from "react";
import useMigrations from "../useMigrations";
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useNavigation} from "react-navi";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {EXECUTING} from "../../../../core/api/actionTypes";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
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
    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setFormio(formio => ({
            ...formio,
            [name]: value
        }));
    }
    return <Container>
        <Row>
            <Col className="mt-5 d-flex flex-column align-items-center justify-content-center">
                <h1>{t('migration.title')}</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <hr className="hr-text" data-content={t('migration.description')}/>
            </Col>
        </Row>
        <Row className="justify-content-center align-items-center">
            <Col>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="url">
                            <Form.Label
                                className="font-weight-bold">Source environment</Form.Label>
                            <Form.Control type="text"
                                          name="url"
                                          required
                                          onChange={handleChange}
                                          isInvalid={formio.url === ''}
                                          placeholder={"Formio URL"}/>
                            <Form.Control.Feedback type="invalid">
                                Formio URL required
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="username">
                            <Form.Label
                                className="font-weight-bold">Username</Form.Label>
                            <Form.Control type="text"
                                          required
                                          name="username"
                                          onChange={handleChange}
                                          isInvalid={formio.username === ''}
                                          placeholder={"Service account username"}/>
                            <Form.Control.Feedback type="invalid">
                                Formio service account username required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="password">
                            <Form.Label
                                className="font-weight-bold">Password</Form.Label>
                            <Form.Control type="password"
                                          required
                                          name="password"
                                          onChange={handleChange}
                                          isInvalid={formio.password === ''}
                                          placeholder={"Service account password"}/>
                            <Form.Control.Feedback type="invalid">
                                Formio service account password required
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="environment">
                            <Form.Label
                                className="font-weight-bold">Target environment</Form.Label>

                            <Form.Control as="select"
                                          name="environment"
                                          onChange={handleChange}>
                                <option hidden selected>Target environment</option>
                                {editableEnvironments().map((env) => {
                                    return <option key={env.id} value={env.id}>{env.label}</option>
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <ButtonToolbar>
                            <Button variant="primary"
                                    block={isMobile}
                                    className="mr-2"
                                    disabled={formInValid() || status === EXECUTING}
                                    onClick={() => {
                                    }}>{status === EXECUTING ? 'Loading forms...' : 'Load forms to migrate'}</Button>
                            <Button data-cy="preview-form"
                                    variant="dark"
                                    block={isMobile}
                                    className="mr-2"
                                    onClick={async () => {
                                        clearEnvContext();
                                        await navigation.navigate("/");
                                    }}>{t('form.cancel.label')}</Button>

                        </ButtonToolbar>
                    </Form.Row>
                </Form>
            </Col>
        </Row>
        <Row>
            <Col>

            </Col>
        </Row>
    </Container>
    // return <Container>
    //     <Confirm open={open}
    //              onCancel={handleCancelMigration}
    //              onConfirm={handleConfirmMigration}
    //              content={t('migration.confirm-content')}
    //              header={t('migration.confirm-header')}
    //     />
    //     <div style={{paddingTop: '20px'}}>
    //         <div style={{textAlign: 'center'}}>
    //             <Header as='h2' icon>
    //                 <Icon name='move'/>
    //                 {t('migration.title')}
    //                 <Header.Subheader> {t('migration.description')}</Header.Subheader>
    //             </Header>
    //         </div>
    //         <Grid columns='equal'>
    //             <Grid.Row>
    //                 <Grid.Column>
    //                     <Form onSubmit={loadForms}>
    //                         <Form.Group>
    //                             <Form.Input name="url" label='Source environment' placeholder='Formio URL' width={6}
    //                                         onChange={
    //                                             (e, {name, value}) => {
    //                                                 setFormio(formio => ({
    //                                                     ...formio,
    //                                                     [name]: value
    //                                                 }));
    //                                             }
    //                                         }
    //                                         error={url === '' || url === null}
    //                                         value={url}
    //                             />
    //                             <Form.Input name="username" label='Username'
    //                                         value={username}
    //                                         error={username === '' || username === null}
    //                                         placeholder='Service account username'
    //                                         width={6} onChange={
    //                                 (e, {name, value}) => {
    //                                     setFormio(formio => ({
    //                                         ...formio,
    //                                         [name]: value
    //                                     }));
    //                                 }
    //                             }/>
    //                             <Form.Input name="password" label='Password'
    //                                         type="password"
    //                                         placeholder='Service account password'
    //                                         value={password}
    //                                         error={password === '' || password === null}
    //                                         width={6} onChange={
    //                                 (e, {name, value}) => {
    //                                     setFormio(formio => ({
    //                                         ...formio,
    //                                         [name]: value
    //                                     }));
    //                                 }
    //                             }/>
    //                         </Form.Group>
    //                         <Form.Select
    //                             width={4}
    //                             fluid
    //                             value={environment}
    //                             label='Target environment'
    //                             error={environment === '' || environment === null}
    //                             options={editableEnvironments().map((env) => {
    //                                 return {
    //                                     key: env.id,
    //                                     text: env.label,
    //                                     value: env.id
    //                                 }
    //                             })}
    //                             onChange={
    //                                 (e, {value}) => {
    //                                     setFormio(formio => ({
    //                                         ...formio,
    //                                         environment: value
    //                                     }));
    //                                 }}
    //                             placeholder='Environment '/>
    //                         <div>
    //                             <Button content='Load forms to migrate' primary disabled={
    //                                 formInValid() || status === EXECUTING
    //                             } loading={status === EXECUTING}/>
    //                             <Button secondary onClick={() => {
    //                                 clearEnvContext();
    //                                 navigation.navigate("/");
    //                             }}>{t('form.cancel.label')}</Button>
    //                         </div>
    //                     </Form>
    //                 </Grid.Column>
    //             </Grid.Row>
    //             <Grid.Row>
    //                 <Grid.Column>
    //                     <Input data-cy="search-title" icon='search'
    //                            name="search-title"
    //                            placeholder={t('form.list.search-label')}
    //                            size='large'
    //                            value={searchTitle}
    //                            disabled={formInValid()}
    //                            onChange={handleTitleSearch}
    //                            fluid focus/>
    //                 </Grid.Column>
    //             </Grid.Row>
    //             <Grid.Row>
    //                 <Grid.Column>
    //                     {status === EXECUTING ?
    //                         <Loader active inline='centered' size='medium'>{t('form.list.loading')}</Loader> :
    //                         <Dimmer.Dimmable dimmed={migrationState.status === EXECUTING}>
    //                             <Dimmer active={migrationState.status === EXECUTING} inverted>
    //                                 <Loader active inline='centered'
    //                                         size='medium'>{t('migration.migrating-label')}</Loader>
    //                             </Dimmer>
    //                             <List divided verticalAlign='middle'>
    //                                 {
    //                                     forms.map((form) => {
    //                                         let checked = false;
    //                                         if (formio.formsIdsForMigration.length !== 0) {
    //                                             if (_.find(formio.formsIdsForMigration, (id) => {
    //                                                 return id === form._id;
    //                                             })) {
    //                                                 checked = true;
    //                                             }
    //                                         }
    //
    //                                         return <List.Item key={form._id}>
    //                                             <List.Content floated='right'>
    //                                                 {!form.exists ?
    //                                                     <Checkbox toggle
    //                                                               value={form._id}
    //                                                               defaultChecked={checked}
    //                                                               onChange={(event, data) => {
    //                                                                   if (data.checked) {
    //                                                                       formio.formsIdsForMigration.push(data.value);
    //                                                                   } else {
    //                                                                       _.remove(formio.formsIdsForMigration, (id) => {
    //                                                                           return id === data.value;
    //                                                                       })
    //                                                                   }
    //                                                                   setFormio(formio => ({
    //                                                                       ...formio
    //                                                                   }));
    //                                                               }}
    //                                                     />
    //                                                     : <Popup content={`${form.name} has already been migrated`}
    //                                                              trigger={<Label color='teal' as='a'>Migrated</Label>}
    //                                                              on='hover'
    //                                                              basic
    //                                                     />}
    //                                             </List.Content>
    //                                             <List.Content>{form.title}</List.Content>
    //                                         </List.Item>
    //                                     })
    //                                 }
    //                             </List>
    //                         </Dimmer.Dimmable>
    //                     }
    //                     {forms.length !== 0 ? <div style={{marginTop: '20px', textAlign: 'center'}}><Pagination
    //                         disabled={total < limit}
    //                         totalPages={Math.ceil(parseInt(total) / limit)}
    //                         activePage={activePage}
    //                         ellipsisItem={isMobile ? null : {
    //                             content: <Icon name='ellipsis horizontal'/>,
    //                             icon: true
    //                         }}
    //                         firstItem={isMobile ? null : {
    //                             content: <Icon name='angle double left'/>,
    //                             icon: true
    //                         }}
    //                         lastItem={isMobile ? null : {
    //                             content: <Icon name='angle double right'/>,
    //                             icon: true
    //                         }}
    //                         prevItem={{content: <Icon name='angle left'/>, icon: true}}
    //                         nextItem={{content: <Icon name='angle right'/>, icon: true}}
    //                         onPageChange={handlePaginationChange}/></div> : null}
    //                 </Grid.Column>
    //             </Grid.Row>
    //             <Grid.Row>
    //                 <Grid.Column>
    //                     {formio.formsIdsForMigration.length !== 0 ? <div><Button
    //                         onClick={() => {
    //                             setFormio(formio => ({
    //                                 ...formio,
    //                                 open: true
    //                             }));
    //                         }}
    //                         loading={migrationState.status === EXECUTING}
    //                         disabled={migrationState.status === EXECUTING}
    //                         primary>{t('migration.migration-action-label', {env: environment})}</Button>
    //                         <Button secondary onClick={() => {
    //                             clearEnvContext()
    //                             navigation.navigate("/");
    //                         }}>{t('form.cancel.label')}</Button></div> : null}
    //
    //                 </Grid.Column>
    //             </Grid.Row>
    //         </Grid>
    //     </div>
    // </Container>
};

export default MigrationPage;
