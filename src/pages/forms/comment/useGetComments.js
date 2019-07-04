import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {SUCCESS} from "../../../core/api/actionTypes";

const useGetComments = (formId) => {
    const initialState = {
        limit: 10,
        activePage: 1,
        data: null,
        total: 0,
    };
    const isMounted = useRef(true);
    const [comments, setComments] = useState(initialState);
    const [comment, setComment] = useState('');

    const CancelToken = axios.CancelToken;

    const cancelCommentsRequest = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/forms/${formId}/comments?limit=${comments.limit}${comments.activePage !== 1 ? `&offset=${((comments.activePage - 1) * comments.limit)}` : ''}`, {
            verb: 'get', params: {
                cancelToken: cancelCommentsRequest.current.token
            }
        }
    );

    const [saveCommentRequestState, saveCommentRequest] = useApiRequest(
        `/forms/${formId}/comments`, {
            verb: 'post', params: {
                comment: comment
            }
        }
    );

    const savedCallback = useRef();
    const cancelRequests = useRef();
    useEffect(() => {
        savedCallback.current = () => {
            makeRequest();
        };
        cancelRequests.current = () => {
            cancelCommentsRequest.current.cancel('Cancelling get comments');
        };
    });

    useEffect(() => {
        savedCallback.current();
    }, [comments.activePage]);

    useEffect(() => {
        return () => {
            cancelRequests.current();
        }
    }, [formId]);


    useEffect(() => {
        if (saveCommentRequestState.status === SUCCESS) {
            if (isMounted.current) {
                const data = comments.data;
                const savedComment = saveCommentRequestState.response.data;
                const total = comments.total + 1;
                if (savedComment) {
                    setComment('');
                    data.unshift(savedComment);
                    if (total > 10) {
                        data.pop();
                    }
                    setComments(comments => ({
                        ...comments,
                        data: data,
                        total: total
                    }));
                }

            }
        }
    }, [saveCommentRequestState, setComments]);

    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                setComments(comments => ({
                    ...comments,
                    data: response.data.comments,
                    total: response.data.total
                }));
            }

        }
    }, [response, status, setComments]);

    const handlePaginationChange = (e, {activePage}) => {
        setComments(forms => ({
            ...forms,
            activePage: activePage
        }));
    };


    const handleNewComment = () => {
        saveCommentRequest();
    };
    return {
        saveCommentRequestState,
        status,
        handlePaginationChange,
        comments,
        handleNewComment,
        comment,
        response,
        setComment,
        exception
    }
};

export default useGetComments;
