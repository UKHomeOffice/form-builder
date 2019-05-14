import React from 'react';
import {Header, Icon, Label} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";
import useEnvContext from "../core/context/useEnvContext";

const AppHeader = () => {
    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const environment = envContext;
    if (environment) {
        const label = environment.label;
        return <div className="center-context"><Header as='h2'>
            <Icon name='cog'/>
            <Header.Content>
                {t('environment.label')} : <Label color={environment.editable? 'teal': 'red'} size="large">
                <div data-cy="context-label">{label ? label : environment.id}</div>
            </Label>
            </Header.Content>
        </Header></div>
    }
    return null;
};

export default AppHeader;
