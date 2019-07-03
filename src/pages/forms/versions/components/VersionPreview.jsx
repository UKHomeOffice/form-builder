import React from "react";
import {Form} from 'react-formio';
import {Container, Grid, Header} from "semantic-ui-react";

const VersionPreview = ({version}) => {
    return <Container>
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Header as='h2'>
                        {version.schema.title}
                        <Header.Subheader>{version.updatedBy ?
                            `Updated by ${version.updatedBy}` : `Updated by ${version.createdBy}`}</Header.Subheader>
                    </Header>
                    <Form form={version.schema} options={{
                        readOnly: true
                    }}/>

                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
};

export default VersionPreview;
