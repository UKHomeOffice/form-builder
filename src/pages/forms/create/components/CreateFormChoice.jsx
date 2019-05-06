import {useNavigation} from "react-navi";
import React from 'react';
import {Button, Divider, Grid, Segment} from 'semantic-ui-react'

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

export default CreateFormChoice;
