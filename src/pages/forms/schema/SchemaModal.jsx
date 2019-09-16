import React from "react";
import ReactJson from "react-json-view";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";


const SchemaModal = ({form, open, close, title}) => {

    return <Modal show={open} onHide={close} dialogClassName="modal-fullscreen">
        <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon={faCode}/><span className="m-2">{title}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ReactJson src={form ? form : {}} theme="monokai" name={null}
                       collapseStringsAfterLength={100}
                       collapsed={2}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={close} data-cy="closeSchemaView">
                Close
            </Button>
        </Modal.Footer>
    </Modal>
};

export default SchemaModal;
