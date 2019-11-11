import React from 'react';
import useGetVersions from "../useGetVersions";
import {useTranslation} from "react-i18next";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
import VersionPreview from "./VersionPreview";
import Overlay from "../../../../common/Overlay";
import {EXECUTING} from "../../../../core/api/actionTypes";

import ReactPaginate from 'react-paginate';

const Versions = ({formId}) => {
    const {versions, status, handlePaginationChange, restore, restoreState, setVersionKey} = useGetVersions(formId);
    const {limit, data, total, versionKey, activePage} = versions;
    const {t} = useTranslation();

    const navItems = data ? data.map((version) => {
        const isLatest = version.latest;
        const label = <React.Fragment>{moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}
            <Badge variant="secondary"
                   className="ml-2 float-right">{moment(version.validFrom).fromNow()}</Badge></React.Fragment>;

        const navItem = <Nav.Item key={version.versionId}>
            <Nav.Link eventKey={version.versionId}>{
                isLatest ?
                    <React.Fragment>{moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}<Badge variant="danger"
                                                                                                    className="ml-2 float-right">Latest</Badge></React.Fragment> : label
            }</Nav.Link>
        </Nav.Item>;
        return navItem
    }) : [];

    const versionTabs = data ? data.map((version) => {
        const versionId = version.versionId;
        return <Tab.Pane key={versionId} eventKey={versionId} mountOnEnter={true} unmountOnExit={true}>
            <VersionPreview versionId={versionId} restore={restore} restoreState={restoreState}/>
        </Tab.Pane>
    }) : [];
    return <Container fluid className="mt-3">
        <Row>
            <Col className="d-flex flex-column align-items-center justify-content-center mt-3">
                <ReactPaginate
                    hrefBuilder={() => "#"}
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    forcePage={activePage}
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
            <Col>
                <Overlay active={!status || status === EXECUTING} loadingText={t('versions.loading')}
                         styleName={"mt-5"}>
                    <Tab.Container id="versions" activeKey={versionKey} onSelect={(key) => setVersionKey(key)}>
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    {navItems}
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    {versionTabs}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Overlay>
            </Col>
        </Row>
    </Container>
};


export default Versions;
