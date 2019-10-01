import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";

const ConfirmLoadLocalChangesModal = ({openLocalChangesDetectedModal,
                                       closeConfirmLoadLocalChangesModal,
                                       loadLocalChanges}) => {

    const {t} = useTranslation();

    return <Modal show={openLocalChangesDetectedModal} onHide={() => closeConfirmLoadLocalChangesModal()}>
        <Modal.Header closeButton>
            <Modal.Title>{t(`form.unsaved.data.detected-local-changes-title`)}</Modal.Title>
        </Modal.Header>
        <Modal.Body><React.Fragment>
            <p>{t(`form.unsaved.data.detected-local-changes`)}</p>
        </React.Fragment></Modal.Body>
        <Modal.Footer>
            <Button
                variant="secondary"
                onClick={() => closeConfirmLoadLocalChangesModal()}>{t('form.unsaved.data.button-cancel')}</Button>
            <Button data-cy="confirm-local"
                    onClick={() => loadLocalChanges()}
                    variant="primary">{t('form.unsaved.data.button-load')}</Button>

        </Modal.Footer>
    </Modal>
};

export default ConfirmLoadLocalChangesModal;
