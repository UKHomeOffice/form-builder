import React from 'react';
import useGetVersions from "../useGetVersions";
import {Icon, Item, Loader, Message, Pagination} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {isMobile} from "react-device-detect";
import {Comment} from "semantic-ui-react/dist/commonjs/views/Comment";

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
    return <React.Fragment><Item.Group divided>
        {data ? data.map((version) => {
            return <Item key={version.versionId}>
                <Item.Content>
                    <Item.Header as='a'>{version.schema.title}</Item.Header>
                </Item.Content>
            </Item>

        }) : null}
    </Item.Group>
        <div style={{marginTop: '20px', textAlign: 'center'}}>
            {total > 1 ? <Pagination totalPages={Math.ceil(parseInt(total) / limit)}
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
