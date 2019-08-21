import React from 'react';
import useGetForms from "../useGetForms";
import {EXECUTING} from "../../../../core/api/actionTypes";
import "../../common/components/FormBuilderComponent.scss"
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import useRoles from "../../common/useRoles";
import './FormList.scss';
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretRight, faCaretUp, faCog, faDownload, faMagic} from "@fortawesome/free-solid-svg-icons";
import CardColumns from "react-bootstrap/CardColumns";
import {faWpforms} from '@fortawesome/free-brands-svg-icons'
import Table from "react-bootstrap/Table";
import _ from 'lodash';
import Button from "react-bootstrap/Button";
import Overlay from "../../../../common/Overlay";
import Collapse from "react-bootstrap/Collapse";
import ListGroup from "react-bootstrap/ListGroup";
import moment from "moment";
import ReactPaginate from 'react-paginate';


const FormList = () => {
    const {
        handleSort,
        forms,
        navigation,
        status,
        response,
        handlePaginationChange,
        handleTitleSearch,
        handleOnSuccessfulDeletion,
        handlePreview,
        handleEditForm,
        handleAccordionClick,
        download,
        downloadFormState,
        handlePromotion,
        filter,
    } = useGetForms();

    const {canEdit} = useRoles();
    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const {direction, column, data, total, activePage, limit} = forms;

    const isLoading = !status || status === EXECUTING;
    const isEditable = (canEdit() && envContext.editable);
    const cursor = {cursor: 'pointer'};
    return <Container>
        <Row>
            <Col style={{marginTop: '1rem'}} sm>
                <CardColumns>
                    <Card bg="light">
                        <Card.Body>
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <FontAwesomeIcon icon={faCog} size='3x'/>
                                </div>
                                <div className="media-body text-right">
                                    <h3>{forms.numberOfForms + forms.numberOfWizards}</h3>
                                    <span>{t('form.list.total-forms', {env: envContext.label})}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card bg="light">
                        <Card.Body>
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <FontAwesomeIcon icon={faWpforms} size="3x"/>
                                </div>
                                <div className="media-body text-right">
                                    <h3>{forms.numberOfForms}</h3>
                                    <span>{t('form.list.total-form-type')}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card bg="light">
                        <Card.Body>
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <FontAwesomeIcon icon={faMagic} size="3x"/>
                                </div>
                                <div className="media-body text-right">
                                    <h3>{forms.numberOfWizards}</h3>
                                    <span>{t('form.list.total-wizard-type')}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </CardColumns>

            </Col>

        </Row>
        <Row>
            <Col style={{marginTop: '1rem'}}>
                <Form.Control type="text"
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
            <Col style={{marginTop: '1rem'}} md="auto">
                <Card style={{height: '7rem'}}>
                    <Card.Header>Filter by</Card.Header>
                    <Card.Body bg="light">
                        <Form>
                            <Form.Group>
                                <Form.Check name="filterBy"
                                            value="all"
                                            onChange={(e) => filter(e, {value: e.target.value})}
                                            inline label="All"
                                            type="radio" id="all"/>
                                <Form.Check name="filterBy"
                                            inline label="Wizard"
                                            value="wizard"
                                            onChange={(e) => filter(e, {value: e.target.value})}
                                            type="radio" id="wizard"/>
                                <Form.Check
                                    name="filterBy"
                                    inline
                                    value="form"
                                    label="Forms"
                                    onChange={(e) => filter(e, {value: e.target.value})}
                                    type="radio"
                                    id='form'
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

        </Row>
        <Row>
            <Col style={{marginTop: '2rem'}}>
                    <Row noGutters={true}>
                        <Col xs={12} md={8}>
                            <ReactPaginate
                                previousLabel={'Previous'}
                                nextLabel={'Next'}
                                breakLabel={'...'}
                                previousClassName={'page-item'}
                                nextClassName={'page-item'}
                                pageCount={Math.ceil(parseInt(total) / limit) }
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={(e) => handlePaginationChange(e.selected)}
                                containerClassName={'pagination'}
                                pageClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                activeClassName={'active'}
                                previousLinkClassName={'page-link'}
                                nextLinkClassName={'page-link'}
                            />
                        </Col>
                        <Col xs={6} md={4}>
                            Total
                        </Col>
                    </Row>

                <Overlay active={isLoading} children={
                    <React.Fragment>


                        <Table responsive striped bordered hover>
                        <thead>
                        <tr>
                            <th style={cursor}
                                onClick={handleSort('title')}>{t('form.list.table.formTitleCellLabel')} {direction && column === 'title' ?
                                <span className="ml-2"><FontAwesomeIcon
                                    icon={direction === 'ascending' ? faCaretDown : faCaretUp}/></span> : null}</th>
                            <th style={cursor}
                                onClick={handleSort('name')}>{t('form.list.table.formNameCellLabel')} {direction && column === 'name' ?
                                <span className="ml-2"><FontAwesomeIcon
                                    icon={direction === 'ascending' ? faCaretDown : faCaretUp}/></span> : null}</th>
                            <th style={cursor}
                                onClick={handleSort('display')}>{t('form.list.table.formTypeCellLabel')} {direction && column === 'display' ?
                                <span className="ml-2"><FontAwesomeIcon
                                    icon={direction === 'ascending' ? faCaretDown : faCaretUp}/></span> : null} </th>
                            <th style={cursor}>{t('form.list.table.formActionsCellLabel')}</th>
                        </tr>
                        </thead>
                        <tbody>

                        {
                            _.map(data, (form, index) => {
                                return <tr key={form.id}>
                                    <td className="align-middle">
                                        <div style={cursor} onClick={(e) => handleAccordionClick(e, {
                                            index: index
                                        })}>{forms.activeIndex === index ? <FontAwesomeIcon icon={faCaretDown}/> :
                                            <FontAwesomeIcon icon={faCaretRight}/>}
                                            <span className="ml-2">{form.title}</span>
                                        </div>
                                        <Collapse in={forms.activeIndex === index}>
                                            <div>
                                                <Card style={{width: '18rem'}}>
                                                    <Card.Header>
                                                        <Card.Title>{form.name}</Card.Title>
                                                        <Card.Subtitle>
                                                            <small className="text-muted">{form.path}</small>
                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <ListGroup variant="flush">
                                                            <ListGroup.Item>
                                                                <div className="text-muted">Identifier:</div>
                                                                <div>{form.id}</div>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <div className="text-muted">Created:</div>
                                                                <div>{moment(form.createdOn).fromNow()}</div>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <div className="text-muted">Updated:</div>
                                                                <div>{moment(form.updatedOn).fromNow()}</div>
                                                            </ListGroup.Item>
                                                        </ListGroup>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Card.Link

                                                            href="#"
                                                            onClick={() => download(form.id, form.name)}><FontAwesomeIcon
                                                            icon={faDownload}/> <span
                                                            className="ml-2">{t('form.download.label')}</span></Card.Link>
                                                    </Card.Footer>
                                                </Card>
                                            </div>
                                        </Collapse>
                                    </td>
                                    <td className="align-middle">{form.name}</td>
                                    <td className="align-middle">
                                        <Button variant="outline-dark" disabled size="sm">{form.display === 'form' ?
                                            <FontAwesomeIcon icon={faWpforms}/> :
                                            <FontAwesomeIcon icon={faMagic}/>} <span
                                            className="ml-1">{form.display}</span></Button>
                                    </td>
                                    <td className="align-middle">
                                        <div className="container">
                                            <div className="row grid-divider">
                                                <div className="col my-1">
                                                    <Button block variant="danger"
                                                            size="sm">Delete</Button>
                                                </div>
                                                <div className="col my-1">
                                                    <Button block variant="primary"
                                                            size="sm">Edit</Button>
                                                </div>

                                                <div className="col my-1">
                                                    <Button block variant="info"
                                                            size="sm">Preview</Button>
                                                </div>
                                                <div className="col my-1">
                                                    <Button block variant="dark" size="sm">Promote</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            })
                        }

                        </tbody>
                    </Table>
                    </React.Fragment>

                }/>
            </Col>
        </Row>
    </Container>;

};


export default FormList;
