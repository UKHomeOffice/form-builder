import React, {useState} from "react";
import {Form} from 'react-formio';
import useEnvContext from "../../../../core/context/useEnvContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import moment from "moment";
import Button from "react-bootstrap/Button";
import {faRedo, faPlusCircle, faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {EXECUTING} from "../../../../core/api/actionTypes";
import Collapse from "react-bootstrap/Collapse";
import ListGroup from "react-bootstrap/ListGroup";

const VersionPreview = ({version, restore, restoreState}) => {
    const {envContext} = useEnvContext();
    const [openDetails, setOpenDetails] = useState(false);

    return <Container>
        <Row className="mt-2">
            <Container fluid>
                <Card>
                    <Card.Header>
                        <a href="#" onClick={() => {
                            setOpenDetails(!openDetails)
                        }}><FontAwesomeIcon icon={openDetails ? faMinusCircle : faPlusCircle}/><span className="ml-2">{version.schema.title}</span></a>
                        <Collapse in={openDetails} className="mt-2 mb-2">
                            <div id="formDetails">
                                <ListGroup variant="flush">
                                    <ListGroup.Item variant="light"><strong>Name:</strong> {version.schema.name}</ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>Path:</strong> {version.schema.path}</ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>FormId:</strong> {version.form.id}</ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>VersionId:</strong> {version.versionId}</ListGroup.Item>
                                    <ListGroup.Item variant="light"><strong>UpdatedBy:</strong> {version.updatedBy ? version.updatedBy : version.createdBy}</ListGroup.Item>
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
            </Container>
        </Row>
    </Container>
    // return <Container>
    //     <Grid columns='equal'>
    //         <Grid.Column>
    //             {envContext.editable ? (!version.latest ?
    //                 <Button primary floated='right'
    //                         disabled={restoreState && restoreState.status === EXECUTING} content='Restore to latest'
    //                         icon='redo'
    //                         loading={restoreState.status === EXECUTING}
    //                         labelPosition='left' onClick={() => {
    //                     restore(version)
    //                 }}/> : null) : null}
    //             <Item>
    //                 <Item.Content>
    //                     <Item.Header><strong>Title:</strong> {version.schema.title}</Item.Header>
    //                     <Item.Meta>
    //                         <span><strong>Name:</strong> {version.schema.name}</span>
    //                     </Item.Meta>
    //                     <Item.Meta>
    //                         <span><strong>Path:</strong> {version.schema.path}</span>
    //                     </Item.Meta>
    //                     <Item.Meta>
    //                         <span><strong>Form Id:</strong> {version.form.id}</span>
    //                     </Item.Meta>
    //                     <Item.Meta>
    //                         <span><strong>Version Id:</strong> {version.versionId}</span>
    //                     </Item.Meta>
    //                     <Item.Extra style={{marginTop: '10px'}}>
    //                         <Label icon='user' content={version.updatedBy ? version.updatedBy : version.createdBy}/>
    //                         <Label icon='time' content={moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}/>
    //                     </Item.Extra>
    //                 </Item.Content>
    //             </Item>
    //             <div style={{marginTop: '10px'}}>
    //                 <Form form={version.schema} options={{
    //                     readOnly: true
    //                 }}/>
    //             </div>
    //         </Grid.Column>
    //     </Grid>
    // </Container>
};

export default VersionPreview;
