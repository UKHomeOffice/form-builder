import React from 'react';
import useGetComments from "../useGetComments";
import {useTranslation} from "react-i18next";
import Avatar from 'react-avatar';
import "./Comments.scss"
import Container from "react-bootstrap/Container";
import Overlay from "../../../../common/Overlay";
import Media from "react-bootstrap/Media";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";
import ReactPaginate from 'react-paginate';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {EXECUTING} from "../../../../core/api/actionTypes";

const Comments = ({formId}) => {
    const {
        comments,
        status,
        handlePaginationChange,
        handleNewComment,
        comment,
        setComment,
    } = useGetComments(formId);

    const {data, total, limit} = comments;
    const {t} = useTranslation();

    return <Container>
        <Row>
            <Col className="d-flex flex-column align-items-center justify-content-center">
                <Card style={{width: '100%'}} className="border-0">
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="comment">
                                <Form.Control as="textarea" rows="3" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </Form.Group>
                        </Form>
                        <Button disabled={comment === ''} className="float-right" variant="primary" onClick={() => handleNewComment()}>Add</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>{total} {total === 1 ? 'comment' : 'comments'}</h4>
                <hr/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Overlay active={!status || status === EXECUTING } styleName="mt-5" loadingText={t('comments.loading')}>
                    <ul className="list-unstyled">
                        {total !== 0 ? data.map((comment) => {
                            return <Media key={comment.id} id={comment.id} className="mt-2" as="li">
                                <Avatar className="avatar" size="40" name={comment.createdBy}/>
                                <Media.Body className="ml-3">
                                    <h6>{comment.createdBy}
                                        <small className="text-muted ml-2">{moment(comment.createdOn).fromNow()}</small>
                                    </h6>
                                    {comment.comment ? <p>{comment.comment}</p> : <p>No comments</p>}
                                </Media.Body>
                            </Media>
                        }) : null}
                    </ul>
                </Overlay>
            </Col>
        </Row>

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
    </Container>
};

export default Comments;
