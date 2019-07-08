import React from "react";
import {Form} from 'react-formio';
import {Button, Container, Grid, Item, Label} from "semantic-ui-react";
import moment from "moment";
import useEnvContext from "../../../../core/context/useEnvContext";
import {EXECUTING} from "../../../../core/api/actionTypes";

const VersionPreview = ({version, restore, restoreState}) => {
    const {envContext} = useEnvContext();
    return <Container>
        <Grid columns='equal'>
            <Grid.Column>
                {envContext.editable ? (!version.latest ?
                    <Button primary floated='right'
                            disabled={restoreState && restoreState.status === EXECUTING} content='Restore to latest'
                            icon='redo'
                            loading={restoreState.status === EXECUTING}
                            labelPosition='left' onClick={() => {
                        restore(version)
                    }}/> : null) : null}
                <Item>
                    <Item.Content>
                        <Item.Header><strong>Title:</strong> {version.schema.title}</Item.Header>
                        <Item.Meta>
                            <span><strong>Name:</strong> {version.schema.name}</span>
                        </Item.Meta>
                        <Item.Meta>
                            <span><strong>Path:</strong> {version.schema.path}</span>
                        </Item.Meta>
                        <Item.Meta>
                            <span><strong>Form Id:</strong> {version.form.id}</span>
                        </Item.Meta>
                        <Item.Meta>
                            <span><strong>Version Id:</strong> {version.versionId}</span>
                        </Item.Meta>
                        <Item.Extra style={{marginTop: '10px'}}>
                            <Label icon='user' content={version.updatedBy ? version.updatedBy : version.createdBy}/>
                            <Label icon='time' content={moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}/>
                        </Item.Extra>
                    </Item.Content>
                </Item>
                <div style={{marginTop: '10px'}}>
                <Form form={version.schema} options={{
                    readOnly: true
                }}/>
                </div>
            </Grid.Column>
        </Grid>
    </Container>
};

export default VersionPreview;
