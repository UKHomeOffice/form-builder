import React, {useContext} from 'react';
import {Header, List} from "semantic-ui-react";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import {useNavigation} from "react-navi";
import {ApplicationContext} from "../../../core/Main";
import {useTranslation} from "react-i18next";

const EnvironmentListPanel = ({environments}) => {
    const {changeContext} = useEnvContext();
    const navigation = useNavigation();
    const {setState} = useContext(ApplicationContext);
    const {t} = useTranslation();


    const handleClick = (environment) => {
        setState(state => ({
            ...state,
            activeMenuItem: t('menu.forms')
        }));
        changeContext(environment);
        navigation.navigate(`/forms/${environment.id}`, {replace: true});
    };

    return <List divided relaxed>
        {
            _.map(environments, (environment) => (
                <List.Item key={environment.id}>
                    <List.Icon name='cog' size='large' verticalAlign='middle'/>
                    <List.Content>
                        <Header as='h5'><a href="#" onClick={() => {
                            handleClick(environment);
                        }}>{environment.label ? environment.label : environment.id}</a></Header>
                        <List.Description>{environment.description}</List.Description>
                    </List.Content>
                </List.Item>
            ))
        }
    </List>
};

export default EnvironmentListPanel;
