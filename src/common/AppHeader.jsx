import React, {useContext} from 'react';
import {Header, Icon} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";
import {ApplicationContext} from "../core/Main";

const AppHeader = () => {
    const {t} = useTranslation();
    const {state} = useContext(ApplicationContext);
    const environment = state.environment;
    if (environment) {
        const label = environment.label;
        return <Header as='h2'>
            <Icon name='settings'/>
            <Header.Content>
                {t('environment.label')} : {label ? label : environment.id}
            </Header.Content>
        </Header>
    }
    return null;
};

export default AppHeader;
