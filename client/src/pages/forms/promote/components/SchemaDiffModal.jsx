import React from 'react';
import Modal from "react-bootstrap/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye";
import Button from "react-bootstrap/Button";
import {ReactGhLikeDiff} from 'react-gh-like-diff';
import 'react-gh-like-diff/lib/diff2html.min.css';

const SchemaDiffModal = ({open, hide, firstSchema, secondSchema}) => {

    return <Modal show={open}
                  onHide={hide}
                  dialogClassName="modal-fullscreen">
        <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon={faEye}/><span className="m-2">Form schema diff</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <ReactGhLikeDiff
                options={{
                    originalFileName: firstSchema ? `${firstSchema.schema.name}` : "",
                    updatedFileName: secondSchema ? `${secondSchema.schema.name}` : ""
                }}
                past={firstSchema ? JSON.stringify(firstSchema.schema, undefined, 2) : ""}
                current={secondSchema ? JSON.stringify(secondSchema.schema, undefined, 2) : ""}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={hide}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
};

export default SchemaDiffModal;