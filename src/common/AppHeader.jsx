import React from 'react';
import { Header, Icon } from 'semantic-ui-react'
import {useTranslation} from "react-i18next";

const AppHeader = () => {
    const {t} = useTranslation();
    return  <Header as='h2'>
        <Icon name='settings' />
        <Header.Content>
            {t('environment.label')}: dev
        </Header.Content>
    </Header>
};

export default AppHeader;
