import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useApiRequest from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import {useToasts} from "react-toast-notifications";
import {useTranslation} from "react-i18next";

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
    const {addToast} = useToasts();
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
                comment: null
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
            let message = '';
            if (response) {
                message = response.data.exception;
            } else {
                message = "No response from Form API server";
            }
            addToast(`${t('error.general')}: ${t('comments.failure.comments-load', {error: message})}`,
                {
                    appearance: 'error'
                });
        };

        failedToSaveCommentCallback.current = () => {
            let message = '';
            if (saveCommentRequestState.response) {
                const saveResponse = saveCommentRequestState.response.data;
                if (saveResponse.validationErrors) {
                    saveResponse.validationErrors.forEach((validationError) => {
                        message += validationError.message + "\n";
                    });
                } else {
                    message = saveResponse.exception;
                }
            } else {
                message = "No response from Form API server";
            }
            addToast(`${t('error.general')}: ${t('comments.failure.create-comment', {error: message})}`,
                {
                    appearance: 'error'
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
                addToast(`${t('comments.success.created')}`,
                    {
                        appearance: 'success',
                        autoDismiss: true,
                        pauseOnHover: true
                    });
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
