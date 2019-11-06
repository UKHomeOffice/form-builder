import React from 'react';
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form';
import {useTranslation} from "react-i18next";
import useGetVersionsForPromotion from "../useGetVersionsForPromotion";
import {EXECUTING} from "../../../../core/api/actionTypes";
import {TextSpinner} from "../../../../common/Overlay";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactPaginate from "react-paginate";
import Badge from "react-bootstrap/Badge";

const VersionsPromotionPanel = ({formId}) => {
    const {status, versions, handlePaginationChange} = useGetVersionsForPromotion(formId);
    const {limit, total} = versions;
    const {t} = useTranslation();
    if (!status || status === EXECUTING) {
        return <TextSpinner loadingText={t('versions.loading')} styleName="mt-5"/>
    }
    return <Container>
        <Row>
            <Col className="d-flex flex-column align-items-center justify-content-center mt-3">
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
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    activeClassName={'active'}
                    previousLinkClassName={'page-link'}
                    nextLinkClassName={'page-link'}
                />
            </Col>
        </Row>
        <Row>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Version Id</th>
                    <th>Updated on</th>
                    <th>Updated by</th>
                    <th>Compare schemas</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {versions.data.map(version => {
                    return <tr key={version.versionId}>
                        <td style={{textAlign: 'center'}}><Form.Check id={version.versionId} name="formVersion"
                                                                      type="radio"/></td>
                        <td>{version.latest? <React.Fragment>
                            <Badge variant="light">{version.versionId}</Badge>
                            <span className="sr-only">latest</span>
                        </React.Fragment> : version.versionId}</td>
                        <td>{moment(version.validFrom).fromNow()}</td>
                        <td>{version.updatedBy ? version.updatedBy : version.createdBy}</td>
                        <td style={{textAlign: 'center'}}>
                            <Form.Check type="checkbox" aria-label="radio 1" onChange={(e) => alert("hello")}/>
                        </td>
                        <td style={{textAlign: 'center'}}>View form</td>
                    </tr>
                })}

                </tbody>
            </Table>
        </Row>
    </Container>
};

export default VersionsPromotionPanel;