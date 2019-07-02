import React from 'react';
import {Button, Comment, Container, Form, Header, Icon, Loader, Pagination} from 'semantic-ui-react'
import useGetComments from "../useGetComments";
import {EXECUTING} from "../../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import moment from 'moment';
import Avatar from 'react-avatar';
import {isMobile} from "react-device-detect";

const Comments = ({formId}) => {
    const {comments, status, handlePaginationChange} = useGetComments(formId);
    const {activePage, data, total, limit} = comments;
    const {t} = useTranslation();
    if (!status || status === EXECUTING) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('comments.loading')}</Loader>
        </div>
    }
    return <Container><Comment.Group>
        <Header as='h3' dividing>
            {total} comments
        </Header>

        {total !== 0 ? data.map((comment) => {
            return <Comment key={comment.id}>
                <Comment>
                    <Comment.Avatar as={() =><Avatar className="avatar" size="35" name={comment.createdBy}/>} />
                    <Comment.Content>
                        <Comment.Author as='a'>{comment.createdBy}</Comment.Author>
                        <Comment.Metadata>
                            <span>{moment(comment.createdOn).fromNow()}</span>
                        </Comment.Metadata>
                        <Comment.Text><p>{comment.comment}</p></Comment.Text>

                    </Comment.Content>
                </Comment>
            </Comment>
        }) : null}
        <Pagination totalPages={Math.ceil(parseInt(total) / limit)}
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
        <Form reply>
            <Form.TextArea/>
            <Button content='Add Reply' labelPosition='left' icon='edit' primary/>
        </Form>
    </Comment.Group></Container>
};

export default Comments;
