import React, {useState} from "react";
import {Form} from 'react-formio';
import useEnvContext from "../../../../core/context/useEnvContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import moment from "moment";
import Button from "react-bootstrap/Button";
import {faMinusCircle, faPlusCircle, faRedo} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {EXECUTING} from "../../../../core/api/actionTypes";
import Collapse from "react-bootstrap/Collapse";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";

const VersionPreview = ({version, restore, restoreState}) => {
    const {envContext} = useEnvContext();
    const [openDetails, setOpenDetails] = useState(false);

    return <Container fluid>
        <Row className="mt-2">
            <Col>
                <Card>
                    <Card.Header>
                        <Button variant="link" onClick={() => {
                            setOpenDetails(!openDetails)
                        }}><FontAwesomeIcon icon={openDetails ? faMinusCircle : faPlusCircle}/><span
                            className="ml-2">{version.schema.title}</span></Button>
                        <Collapse in={openDetails} className="mt-2 mb-2">
                            <div id="formDetails">
                                <ListGroup variant="flush">
                                    <ListGroup.Item variant="light"><strong>Name:</strong> {version.schema.name}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>Path:</strong> {version.schema.path}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>FormId:</strong> {version.form.id}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>VersionId:</strong> {version.versionId}
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                        variant="light"><strong>UpdatedBy:</strong> {version.updatedBy ? version.updatedBy : version.createdBy}
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>
                        </Collapse>{envContext.editable ? (!version.latest ?
                        <Button
                            variant="success"
                            disabled={restoreState.status === EXECUTING}
                            onClick={() => {
                                restore(version)
                            }}
                            className="float-right">
                            <FontAwesomeIcon icon={faRedo}/>
                            <span className="ml-2">{restoreState.status === EXECUTING ? 'Restoring' : 'Restore'}</span>
                        </Button> : null) : null}</Card.Header>
                    <Card.Body>
                        <Form form={version.schema} options={{
                            readOnly: true
                        }}/>
                    </Card.Body>
                    <Card.Footer className="text-muted">Updated {moment(version.validFrom).fromNow()}</Card.Footer>
                </Card>
            </Col>
        </Row>
    </Container>
};

export default VersionPreview;
