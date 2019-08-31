import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import eventEmitter from "../../../core/eventEmitter";
import uuid4 from "uuid4";
import {toast} from "react-toastify";

const useGetComments = (formId) => {
    const {t} = useTranslation();
    const initialState = {
        limit: 5,
        activePage: 0,
        data: null,
        total: 0,
    };
    const isMounted = useRef(true);
    const [comments, setComments] = useState(initialState);
    const [comment, setComment] = useState('');
    const CancelToken = axios.CancelToken;

    const cancelCommentsRequest = useRef(CancelToken.source());

    const [{status, response, exception}, makeRequest] = useApiRequest(
        `/form/${formId}/comments?limit=${comments.limit}&offset=${((comments.activePage) * comments.limit)}`, {
            verb: 'get', params: {
                cancelToken: cancelCommentsRequest.current.token
            }
        }
    );

    const [saveCommentRequestState, saveCommentRequest] = useApiRequest(
        `/form/${formId}/comments`, {
            verb: 'post', params: {
                comment: comment
            }
        }
    );

    const savedCallback = useRef();
    const cancelRequests = useRef();

    const failedToLoadCommentsCallback = useRef();
    const failedToSaveCommentCallback = useRef();
    const successfullySavedCommentCallback = useRef();


    useEffect(() => {
        savedCallback.current = () => {
            makeRequest();
        };
        cancelRequests.current = () => {
            cancelCommentsRequest.current.cancel('Cancelling get comments');
            isMounted.current = false;
        };

        failedToLoadCommentsCallback.current = () => {
            eventEmitter.publish('error', {
                id: uuid4(),
                exception: exception,
                response: response,
                translateKey: 'comments.failure.comments-load'
            });
        };

        failedToSaveCommentCallback.current = () => {
            eventEmitter.publish('error', {
                id: uuid4(),
                exception: saveCommentRequestState.exception,
                response: saveCommentRequestState.response,
                translateKey: 'comments.failure.create-comment'
            });
        };

        successfullySavedCommentCallback.current = () => {
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
                toast.success(`${t('comments.success.created')}`);
            }
        }

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
                successfullySavedCommentCallback.current();
            }
        }
        if (saveCommentRequestState.status === ERROR) {
            failedToSaveCommentCallback.current();
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
        if (status === ERROR) {
            if (isMounted.current) {
                failedToLoadCommentsCallback.current();
            }
        }
    }, [response, status, setComments]);

    const handlePaginationChange = (page) => {
        setComments(forms => ({
            ...forms,
            activePage: page
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
