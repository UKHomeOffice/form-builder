import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";
import FormJsonSchemaEditor from "../edit/components/FormJsonSchemaEditor";


const SchemaModal = ({form, open, close, title}) => {
    const [mode, setMode] = useState('code');
    return <Modal show={open} onHide={close} dialogClassName="modal-fullscreen">
        <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon={faCode}/><span className="m-2">{title}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormJsonSchemaEditor
                readonly={true}
                json={form}
                mode={mode}
                handleEditModeView={(e) => {
                    setMode(e.target.value);
                }}
                indentation={2}
            />

        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={close} data-cy="closeSchemaView">
                Close
            </Button>
        </Modal.Footer>
    </Modal>
};

export default SchemaModal;
