import React from 'react';
import useGetVersions from "../useGetVersions";
import {Icon, Label, Loader, Message, Pagination, Tab} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {isMobile} from "react-device-detect";
import VersionPreview from "./VersionPreview";
import moment from "moment";

const Versions = ({formId}) => {
    const {versions, status, response, handlePaginationChange} = useGetVersions(formId);
    const {activePage, limit, data, total} = versions;
    const {t} = useTranslation();
    if (!status || status === EXECUTING) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('versions.loading')}</Loader>
        </div>
    }
    if (status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('versions.failure.versions-load', {error: JSON.stringify(response.data)})}
        </Message>
    }

    const panes = data ? data.map((version) => {
        const item = version.latest ? `Latest (${moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")})`
            : `${moment(version.validTo).format("DD-MM-YYYY HH:mm:ss")} (${ moment(version.validTo).fromNow()})` ;
        return {
            menuItem: item,
            render: () => <Tab.Pane><VersionPreview version={version}/></Tab.Pane>
        }
    }) : [];

    return <React.Fragment><Tab menu={{fluid: true, vertical: true, tabular: true}} panes={panes}/>
        <div style={{marginTop: '20px', textAlign: 'center'}}>
            {total > 10 ? <Pagination totalPages={Math.ceil(parseInt(total) / limit)}
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
                                     onPageChange={handlePaginationChange}/>
                : null}</div>
    </React.Fragment>
};


export default Versions;
