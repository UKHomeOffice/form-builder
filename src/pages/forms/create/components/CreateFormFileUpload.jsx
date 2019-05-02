import React from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react'

const CreateFormFileUpload = () => {
    return <Segment placeholder>
        <Header icon>
            <Icon name='file code outline' />
            Use to upload an existing JSON form
        </Header>
        <Button primary>Add form</Button>
    </Segment>
};

export default CreateFormFileUpload;
