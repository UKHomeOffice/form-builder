import React, {useEffect, useRef, useState} from "react";
import useApiRequest from "../../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {useToasts} from "react-toast-notifications";

const DeleteFormButton = ({form, onSuccessfulDeletion}) => {
    const [open, setOpen] = useState(false);
    const {addToast} = useToasts();
    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${form.id}`, {verb: 'delete'}
    );
    const {t} = useTranslation();

    const savedCallback = useRef();
    const failedDeletionCallback = useRef();

    const callback = () => {
        setOpen(false);
        addToast(`${t('form.delete.successful', {formName: form.name})}`,
            {
                appearance: 'success',
                autoDismiss: true,
                pauseOnHover: true
            });
        onSuccessfulDeletion()
    };
    const failedCallback = () => {
        setOpen(false);
        const message = response ? JSON.stringify(response.data.exception) : 'Failed to connect to API Server';
        addToast(`${t('form.delete.failure.failed-to-delete', {formName: form.name, error: message})}`,
            {
                appearance: 'danger',
                autoDismiss: true,
                pauseOnHover: true
            });
    };

    useEffect(() => {
        savedCallback.current = callback;
        failedDeletionCallback.current = failedCallback;
    });
    useEffect(() => {
        if (status === SUCCESS) {
            savedCallback.current();
        }
        if (status === ERROR) {
            failedDeletionCallback.current();
        }
    }, [status]);

    return (<React.Fragment>
        <Button block variant="danger"
                disabled={open}
                data-cy="delete-form" onClick={() => setOpen(true)}
                size="sm">Delete</Button>


        <Modal show={open} onHide={() => setOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t('form.delete.confirm', {formName: form.name})}</Modal.Title>
            </Modal.Header>
            {status === EXECUTING ?
                <Modal.Body><React.Fragment>
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className="row">
                            <div className="spinner-border text-warning" role="status">
                                <span className="sr-only">{t('form.delete.message.content')}</span>
                            </div>
                        </div>
                        <div className="row">
                            <strong>
                                {t('form.delete.message.content')} {form.name}
                            </strong>
                        </div>
                    </div>
                </React.Fragment></Modal.Body>
                : null
            }

            <Modal.Footer>
                <Button
                    disabled={status === EXECUTING}
                    variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button data-cy="confirm-delete"
                        disabled={status === EXECUTING}
                        onClick={() => makeRequest()}
                        variant="danger">{t('form.list.delete-label')}</Button>

            </Modal.Footer>
        </Modal>

    </React.Fragment>);

};

export default DeleteFormButton;
