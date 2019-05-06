import React from 'react';
import { Header, Icon } from 'semantic-ui-react'

const AppHeader = () => {
    return  <Header as='h2'>
        <Icon name='settings' />
        <Header.Content>
            Environment: dev
        </Header.Content>
    </Header>
};

export default AppHeader;
