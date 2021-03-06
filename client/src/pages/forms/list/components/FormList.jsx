import React from 'react';
import useGetForms from "../useGetForms";
import {EXECUTING} from "../../../../core/api/actionTypes";
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
import {
    faCaretDown,
    faCaretRight,
    faCaretUp,
    faCog,
    faDownload,
    faMagic,
    faPlus,
    faList
} from "@fortawesome/free-solid-svg-icons";
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
import ButtonGroup from "./ButtonGroup";
import {isMobile} from "react-device-detect";


const FormList = () => {
    const {
        handleSort,
        forms,
        navigation,
        status,
        handlePaginationChange,
        handleTitleSearch,
        handleOnSuccessfulDeletion,
        handlePreview,
        handleEditForm,
        handleAccordionClick,
        download,
        handlePromotion,
        filter,
    } = useGetForms();

    const {canEdit} = useRoles();
    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const {direction, column, data, total, limit} = forms;

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
                              name="search-title"
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
                                            data-cy="filter-all"
                                            value="all"
                                            onChange={(e) => filter(e, {value: e.target.value})}
                                            inline label="All"
                                            type="radio" id="all"/>
                                <Form.Check name="filterBy"
                                            inline label="Wizard"
                                            data-cy="filter-wizard"
                                            value="wizard"
                                            onChange={(e) => filter(e, {value: e.target.value})}
                                            type="radio" id="wizard"/>
                                <Form.Check
                                    name="filterBy"
                                    data-cy="filter-form"
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
            <Col className="mt-2">
                {isEditable ? <div className="float-lg-left float-md-left float-sm-none mt-2">
                    <Button onClick={async () => await navigation.navigate(`/forms/${envContext.id}/create`)}
                            data-cy="create-form">
                        <FontAwesomeIcon icon={faPlus} title={t('form.create.label')}/> {t('form.create.label')}
                    </Button>
                </div> : null}
                <div className="float-lg-right float-md-right float-sm-none mt-2">
                    <ReactPaginate
                        hrefBuilder={() => "#"}
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        pageCount={Math.ceil(parseInt(total) / limit)}
                        marginPagesDisplayed={isMobile? 1 : 2}
                        pageRangeDisplayed={isMobile? 2 : 5 }
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
            <Col>
                <Overlay active={!status || status === EXECUTING} styleName="mt-5" children={
                    <Table responsive striped bordered hover data-cy="forms-table">
                        <caption><FontAwesomeIcon icon={faList}/><span className="ml-1">{total} forms</span></caption>
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
                        <tbody data-cy="form-table-data">

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
                                                <Card style={{width: '100%'}}>
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
                                    <td className="align-middle" style={{width:'25rem'}}>
                                        <ButtonGroup form={form}
                                                     handlePreview={handlePreview}
                                                     handleEditForm={handleEditForm}
                                                     handlePromotion={handlePromotion}
                                                     handleOnSuccessfulDeletion={handleOnSuccessfulDeletion}/>

                                    </td>
                                </tr>
                            })
                        }

                        </tbody>
                    </Table>
                }/>
            </Col>
        </Row>
    </Container>;

};


export default FormList;
