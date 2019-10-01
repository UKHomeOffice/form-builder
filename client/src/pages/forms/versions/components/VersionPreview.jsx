import React from "react";
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
import useGetVersion from "../useGetVersion";

const VersionPreview = ({versionId, restore, restoreState}) => {
    const {envContext} = useEnvContext();
    const {setVersion, version, status} = useGetVersion(versionId);
    if (!version.data || (!status || status === EXECUTING)) {
        return <div>Loading...</div>
    }
    return <Container fluid>
        <Row className="mt-2">
            <Col>
                <Card>
                    <Card.Header>
                        <Button variant="link" onClick={() => {
                            setVersion(version => ({
                                ...version,
                                openDetails: !version.openDetails
                            }));
                        }}><FontAwesomeIcon icon={version.openDetails ? faMinusCircle : faPlusCircle}/><span
                            className="ml-2">{version.data.schema.title}</span></Button>
                        <Collapse in={version.openDetails} className="mt-2 mb-2">
                            <div id="formDetails">
                                <ListGroup variant="flush">
                                    <ListGroup.Item variant="light"><strong>Name:</strong> {version.data.schema.name}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>Path:</strong> {version.data.schema.path}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>FormId:</strong> {version.data.schema.id}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>VersionId:</strong> {version.data.versionId}
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                        variant="light"><strong>UpdatedBy:</strong> {version.data.updatedBy ? version.data.updatedBy : version.data.createdBy}
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>
                        </Collapse>{envContext.editable ? (!version.data.latest ?
                        <Button
                            variant="success"
                            disabled={restoreState.status === EXECUTING}
                            onClick={() => {
                                restore(version.data.versionId)
                            }}
                            className="float-right">
                            <FontAwesomeIcon icon={faRedo}/>
                            <span className="ml-2">{restoreState.status === EXECUTING ? 'Restoring' : 'Restore'}</span>
                        </Button> : null) : null}</Card.Header>
                    <Card.Body>
                        <Form form={version.data.schema} options={{
                            readOnly: true
                        }}/>
                    </Card.Body>
                    <Card.Footer className="text-muted">Updated {moment(version.data.validFrom).fromNow()}</Card.Footer>
                </Card>
            </Col>
        </Row>
    </Container>
};

export default VersionPreview;
