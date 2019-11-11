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
import PreviewFormModal from "../../create/components/PreviewFormModal";
import SchemaDiffModal from "./SchemaDiffModal";

const VersionsPromotionPanel = ({formId, selectFormToPromote}) => {
    const {status, versions, handleVersionPagination, compare, showVersion,
            hideVersion, hideCompare} = useGetVersionsForPromotion(formId);
    const {limit, total, activePage} = versions;
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
                    onPageChange={(e) => {
                        handleVersionPagination(e.selected)
                    }}
                    forcePage={activePage}
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
                    <th/>
                </tr>
                </thead>
                <tbody>
                {versions.data.map(version => {
                    return <tr key={version.versionId}>
                        <td style={{textAlign: 'center'}}><Form.Check id={version.versionId}
                                                                      onChange={()=> selectFormToPromote(version)}
                                                                      name="formVersion"
                                                                      type="radio"/></td>
                        <td>{version.latest? <React.Fragment>
                            {version.versionId}<span><Badge variant="danger"> Latest</Badge></span>
                        </React.Fragment> : version.versionId}</td>
                        <td>{moment(version.validFrom).fromNow()}</td>
                        <td>{version.updatedBy ? version.updatedBy : version.createdBy}</td>
                        <td style={{textAlign: 'center'}}>
                            <Form.Check type="checkbox" aria-label="radio 1" onChange={(e) => {
                                if (e.target.checked
                                        && (versions.versionsToCompare.first !== null && versions.versionsToCompare.second !== null)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    alert("You cannot select more than 2 schemas to compare");
                                    return false;
                                } else {
                                    compare(e, version)
                                }
                            }}/>
                        </td>
                        <td style={{textAlign: 'center'}}><a href="#" onClick={() => showVersion(version)} >View form</a></td>
                    </tr>
                })}

                </tbody>
            </Table>
        </Row>
        <Row>
            <PreviewFormModal form={versions.versionToView? versions.versionToView.schema: {}} open={versions.versionToView}
                              onClosePreview={hideVersion}/>
        </Row>
        <Row>
            <SchemaDiffModal open={versions.showCompareModal} hide={hideCompare}
                             firstSchema={versions.versionsToCompare.first ? versions.versionsToCompare.first: ""}
                             secondSchema={versions.versionsToCompare.second ?versions.versionsToCompare.second: ""}/>
        </Row>
    </Container>
};

export default VersionsPromotionPanel;