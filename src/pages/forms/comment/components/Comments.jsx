import React from 'react';
import {Button, Comment, Container, Form, Header, Icon, Loader, Pagination, Message} from 'semantic-ui-react'
import useGetComments from "../useGetComments";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import moment from 'moment';
import Avatar from 'react-avatar';
import {isMobile} from "react-device-detect";
import "./Comments.scss"

const Comments = ({formId}) => {
    const {
        comments,
        status,
        handlePaginationChange,
        handleNewComment,
        saveCommentRequestState,
        comment,
        response,
        setComment
    } = useGetComments(formId);
    const {activePage, data, total, limit} = comments;
    const {t} = useTranslation();
    if (!status || status === EXECUTING) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('comments.loading')}</Loader>
        </div>
    }
    if (status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('comments.failure.comments-load', {error: JSON.stringify(response.data)})}
        </Message>
    }
    if (saveCommentRequestState.status === ERROR) {
        return <Message negative>
            <Message.Header>{t('error.general')}</Message.Header>
            {t('comments.failure.create-comment', {error: JSON.stringify(saveCommentRequestState.response.data)})}
        </Message>
    }

    return <Container><div className="center-comments"><Comment.Group>
        <Header as='h3' dividing>
            {total} comments
        </Header>
        {total !== 0 ? data.map((comment) => {

            return <Comment key={comment.id}>
                <Comment>
                    <Avatar className="avatar" size="35" name={comment.createdBy} />
                    <Comment.Content>
                        <Comment.Author as='a'>{comment.createdBy}</Comment.Author>
                        <Comment.Metadata>
                            <span>{moment(comment.createdOn).fromNow()}</span>
                        </Comment.Metadata>
                        <Comment.Text>{comment.comment?  <p>{comment.comment}</p> : <p>No comments</p>}</Comment.Text>
                    </Comment.Content>
                </Comment>
            </Comment>
        }) : null}

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
            : null}
        <Form reply loading={saveCommentRequestState.status === EXECUTING}>
            <Form.TextArea onChange={(e, {value}) => setComment(value)} value={comment}/>
            <Button content='Add comment' labelPosition='left' icon='edit' primary onClick={() => handleNewComment()}
                    disabled={comment === ''}/>
        </Form>
    </Comment.Group></div></Container>
};

export default Comments;
