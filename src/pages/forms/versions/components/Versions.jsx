import React from 'react';
import useGetVersions from "../useGetVersions";
import {Icon, Loader, Message, Pagination, Tab, Menu, Label} from "semantic-ui-react";
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
        const item = <Menu.Item key={version.versionId}>{moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}{version.latest ? <Label color='red' size='medium'><Icon name='time' /> Latest</Label> : <Label size='medium'> <Icon name='time' />{ moment(version.validFrom).fromNow()}</Label>}</Menu.Item>;
        return {
            menuItem: item,
            render: () => <Tab.Pane><VersionPreview version={version}/></Tab.Pane>
        }
    }) : [];

    return <React.Fragment><Tab menu={{fluid: true, vertical: true, tabular: true}} panes={panes}/>
        <div style={{marginTop: '20px', textAlign: 'center'}}>
            <Pagination totalPages={Math.ceil(parseInt(total) / limit)}
                        disabled={total < limit}
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
        </div>
    </React.Fragment>
};


export default Versions;
