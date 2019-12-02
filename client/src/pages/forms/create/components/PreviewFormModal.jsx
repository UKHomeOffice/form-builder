import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import './PreviewFormModal.scss';
import PreviewFormComponent from "../../common/components/PreviewFormComponent";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faExclamationTriangle,
    faEye
} from "@fortawesome/free-solid-svg-icons";

const PreviewFormModal = ({form, open, onClosePreview}) => {
    const [submission, setSubmission] = useState(null);
    const [mode, setMode] = useState('code');
    let formioRef;
    const {t} = useTranslation();
    return <Modal show={open} onHide={onClosePreview}
                  dialogClassName="modal-fullscreen">
        <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon={faEye}/><span
                className="m-2">{t('form.preview.label')}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {!form ? <Alert variant="warning">
                    <Alert.Heading><FontAwesomeIcon icon={faExclamationTriangle}/><span
                        className="m-2">{t('form.create.preview.modal.missing-form.title')}</span></Alert.Heading>
                    <p>{t('form.create.preview.modal.missing-form.message')}</p>
                </Alert> :
                <PreviewFormComponent
                    form={form} submission={submission}
                    mode={mode}
                    handleFormioRef={(form) => formioRef = form}
                    handleEditorModeViewChange={(e) => {
                        setMode(e.target.value);
                    }
                    }
                    handlePreview={(submission) => {
                        if (formioRef) {
                            formioRef.formio.emit("submitDone");
                        }
                        setSubmission(submission)
                    }}/>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClosePreview}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
};

export default PreviewFormModal;
