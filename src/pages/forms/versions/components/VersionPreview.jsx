import React from "react";
import {Form} from 'react-formio';
import {Container, Grid, Item, Label} from "semantic-ui-react";
import moment from "moment";

const VersionPreview = ({version}) => {
    return <Container>
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Item>
                        <Item.Content>
                            <Item.Header>Title: {version.schema.title}</Item.Header>
                            <Item.Meta>
                                <span>Name: {version.schema.name}</span>
                            </Item.Meta>
                            <Item.Meta>
                                <span>Path: {version.schema.path}</span>
                            </Item.Meta>
                            <Item.Extra>
                                <Label icon='user' content={version.createdBy}/>
                                <Label icon='time' content={moment(version.validFrom).format("DD-MM-YYYY HH:mm:ss")}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                    <Form form={version.schema} options={{
                        readOnly: true
                    }}/>

                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
};

export default VersionPreview;
