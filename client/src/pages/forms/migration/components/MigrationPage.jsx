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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faList,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from 'react-paginate';
import _ from "lodash";
import Overlay from "../../../../common/Overlay";
import Table from "react-bootstrap/Table";
import ExtendedBootstrapSwitchButton from "../../../../common/ExtendedBootstrapSwitchButton";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";

const MigrationPage = () => {
    const {
        loadForms, formio, setFormio, formInValid, status, handlePaginationChange, handleCancelMigration,
        handleConfirmMigration, migrationState, handleTitleSearch
    } = useMigrations();
    const {forms, total, limit,  open} = formio;
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
    };
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
                                <option hidden defaultValue={null}>Target environment</option>
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
                                        loadForms()
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
                <div className="float-right">
                    <ReactPaginate
                        hrefBuilder={() => "#"}
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        pageCount={Math.ceil(parseInt(total) / limit)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(e) => handlePaginationChange(e.selected)}
                        containerClassName={'pagination'}
                        breakClassName={'page-link'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        activeClassName={'active'}
                        previousLinkClassName={'page-link'}
                        nextLinkClassName={'page-link'}
                    />
                </div>
            </Col>
        </Row>
        <Row>
            <Col style={{marginTop: '1rem'}}>
                <Form.Control type="text"
                              disabled={formInValid()}
                              placeholder={t('form.list.search-label')}
                              onChange={(e) => {
                                  handleTitleSearch(e, {
                                      value: e.target.value
                                  })
                              }}
                />
            </Col>
        </Row>
        <Row>
            <Col className="mt-3">
                <Overlay active={status === EXECUTING}  styleName="mt-3" children={
                    <Table responsive striped bordered hover>
                        <caption><FontAwesomeIcon icon={faList}/><span className="ml-1">{total} forms</span></caption>
                        <thead>
                        <tr>
                            <th>{t('form.list.table.formTitleCellLabel')}</th>
                            <th>{t('form.list.table.formNameCellLabel')}</th>
                            <th>Migrated</th>
                        </tr>
                        </thead>
                        <tbody>

                        <React.Fragment>
                            {
                                _.map(forms, (form) => {
                                    let checked = false;
                                    const exists = form.exists;
                                    const formId = form._id;
                                    if (formio.formsIdsForMigration.length !== 0) {
                                        if (_.find(formio.formsIdsForMigration, (id) => {
                                            return id === form._id;
                                        })) {
                                            checked = true;
                                        }
                                    }

                                    return <tr key={formId}>
                                       <td>{form.title}</td>
                                       <td>{form.name}</td>
                                        <td> {form.exists?
                                            <React.Fragment>
                                                <h5 className="text-center"><Badge variant="info"><FontAwesomeIcon icon={faCheck}/><span className="ml-1">Migrated</span></Badge></h5>
                                            </React.Fragment>:
                                           <ExtendedBootstrapSwitchButton
                                               key={formId}
                                               checked={exists || checked}
                                               disabled={exists}
                                               onlabel={"Migrate"}
                                               onstyle='primary'
                                               offlabel={"Migrate?"}
                                               offstyle='info'
                                               style='w-100 mt-2'
                                               onChange={(checked) => {
                                                   if (checked) {
                                                       formio.formsIdsForMigration.push(formId);
                                                   } else {
                                                       _.remove(formio.formsIdsForMigration, (id) => {
                                                           return id === formId;
                                                       })
                                                   }
                                                   setFormio(formio => ({
                                                       ...formio
                                                   }));
                                               }}
                                           />}
                                       </td>
                                   </tr>
                                })
                            }
                        </React.Fragment>
                        </tbody>
                    </Table>
                }/>
            </Col>
        </Row>
        <Row>
            <Col>
                <ButtonToolbar>
                    <Button variant="primary"
                            block={isMobile}
                            className="mr-2"
                            disabled={migrationState.status === EXECUTING || formio.formsIdsForMigration.length === 0}
                            onClick={() => {
                                setFormio(formio => ({
                                ...formio,
                                open: true
                            }));
                            }}>{migrationState.status === EXECUTING ? 'Migrating forms....' : 'Migrate selected forms'}</Button>
                    <Button data-cy="preview-form"
                            variant="dark"
                            block={isMobile}
                            className="mr-2"
                            onClick={async () => {
                                clearEnvContext();
                                await navigation.navigate("/");
                            }}>{t('form.cancel.label')}</Button>

                </ButtonToolbar>
            </Col>
        </Row>
        <Modal show={open} onHide={() => handleCancelMigration()}>
            <Modal.Header closeButton>
                <Modal.Title>{t('migration.confirm-header')}</Modal.Title>
            </Modal.Header>
            <Modal.Body><React.Fragment>
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <p>{t('migration.confirm-content')}</p>
                </div>
            </React.Fragment></Modal.Body>
            <Modal.Footer>
                <Button
                    disabled={migrationState.status === EXECUTING}
                    variant="secondary" onClick={() => handleCancelMigration()}>Cancel</Button>
                <Button data-cy="confirm-migration"
                        disabled={migrationState.status === EXECUTING}
                        onClick={() =>handleConfirmMigration()}
                        variant="primary">Migrate</Button>

            </Modal.Footer>
        </Modal>
    </Container>
};

export default MigrationPage;
