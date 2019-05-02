import React from 'react';
import {mount, route} from 'navi'
import {Button, Divider, Grid, Segment} from 'semantic-ui-react'
import {useNavigation} from "react-navi";
import CreateFormBuilder from "./components/CreateFormBuilder";
import CreateFormFileUpload from "./components/CreateFormFileUpload";

const CreateFormChoice = () => {
    const navigation = useNavigation();
    return <Segment placeholder>
        <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
                <Button content="Use builder" icon="wpforms" size="big" onClick={() => {
                    navigation.navigate("/forms/create/builder");
                }}/>
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
                <Button content='Upload form' icon='upload' size='big' onClick={() => {
                    navigation.navigate("/forms/create/file-upload");
                }}/>
            </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
    </Segment>
};


export default mount({
    '/': route({
        title: 'Create Form',
        view: <CreateFormChoice/>
    }),
    '/builder': route({
        title: 'Create form with builder',
        view: <CreateFormBuilder/>
    }),
    '/file-upload': route({
        title: 'Create form with file upload',
        view: <CreateFormFileUpload/>
    })
});


