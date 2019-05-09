import React from 'react';
import {Header, Icon} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";
import useEnvContext from "../core/context/useEnvContext";

const AppHeader = () => {
    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const environment = envContext;
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
