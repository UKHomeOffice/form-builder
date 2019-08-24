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

const Versions = ({formId}) => {
    const {versions, status, response, handlePaginationChange, exception, restore, restoreState} = useGetVersions(formId);
    const {activePage, limit, data, total} = versions;
    const {t} = useTranslation();
    // if (!status || status === EXECUTING) {
    //     return <div className="center"><Loader active inline='centered' size='large'>{t('versions.loading')}</Loader>
    //     </div>
    // }
    // if (status === ERROR) {
    //     return <Container><Message negative>
    //         <Message.Header>{t('error.general')}</Message.Header>
    //         {t('versions.failure.versions-load', {error: response ? JSON.stringify(response.data) : exception.message})}
    //     </Message></Container>
    // }
    //
    // const panes = data ? data.map((version) => {
    //     const item = <Menu.Item
    //         key={version.versionId}>
    //         {version.latest ?
    //             <React.Fragment>{moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}<Label color='red'
    //                                                                                             size='small'>Latest</Label></React.Fragment>
    //             : <React.Fragment>
    //                 {moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}
    //                 <Label size='small'>{moment(version.validFrom).fromNow()}</Label>
    //             </React.Fragment>
    //         }
    //
    //     </Menu.Item>;
    //     return {
    //         menuItem: item,
    //         render: () => <Tab.Pane><VersionPreview version={version} restore={restore}
    //                                                 restoreState={restoreState}/></Tab.Pane>
    //     }
    // }) : [];

    //
    // return <React.Fragment>
    //     <Tab menu={{fluid: true, vertical: true, tabular: true}} panes={panes}/>
    //     <div style={{marginTop: '20px', textAlign: 'center'}}>
    //         <Pagination totalPages={Math.ceil(parseInt(total) / limit)}
    //                     disabled={total <= limit}
    //                     activePage={activePage}
    //                     ellipsisItem={isMobile ? null : {
    //                         content: <Icon name='ellipsis horizontal'/>,
    //                         icon: true
    //                     }}
    //                     firstItem={isMobile ? null : {
    //                         content: <Icon name='angle double left'/>,
    //                         icon: true
    //                     }}
    //                     lastItem={isMobile ? null : {
    //                         content: <Icon name='angle double right'/>,
    //                         icon: true
    //                     }}
    //                     prevItem={{content: <Icon name='angle left'/>, icon: true}}
    //                     nextItem={{content: <Icon name='angle right'/>, icon: true}}
    //                     onPageChange={handlePaginationChange}/>
    //     </div>
    // </React.Fragment>

    const navItems = data ? data.map((version) => {
        const isLatest = version.latest;
        const label = <React.Fragment>{moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}
             <Badge variant="secondary" className="ml-2 float-right">{moment(version.validFrom).fromNow()}</Badge></React.Fragment>;

        const navItem = <Nav.Item key={version.versionId}>
            <Nav.Link eventKey={isLatest ? 'latest' : version.versionId}>{
                isLatest ? <React.Fragment>{moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}<Badge variant="danger" className="ml-2 float-right">Latest</Badge></React.Fragment> : label
            }</Nav.Link>
        </Nav.Item>;
        return navItem
    }) : [];

    const versionTabs = data ? data.map((version) => {
        const key = version.latest ? 'latest' : version.versionId;
        return  <Tab.Pane key={version.versionId} eventKey={key}>
            <VersionPreview version={version} restore={restore} restoreState={restoreState}/>
        </Tab.Pane>
    }) : [];

    return <Container fluid className="mt-3">
        <Tab.Container id="versions" defaultActiveKey="latest">
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
    </Container>
};


export default Versions;
