import React, {useState} from 'react';
import {Dropdown, Menu} from 'semantic-ui-react';
import {useKeycloak} from 'react-keycloak';
import {useCurrentRoute, useNavigation} from "react-navi";
import {useTranslation} from "react-i18next";
import secureLS from '../core/storage';
import _ from 'lodash';
import environments from '../environments';
import useEnvContext from "../core/context/useEnvContext";

const AppMenu = () => {
    const route = useCurrentRoute();
    const navigation = useNavigation();
    const {t} = useTranslation();
    const [keycloak] = useKeycloak();
    const {changeContext, clearEnvContext} = useEnvContext();

    const handleClick = (environment) => {
        changeContext(environment);
    };

    const path = route.url.pathname;
    const [activeItem, setActiveItem] = useState(path === '/' ? t('menu.home') : path);

    return <Menu stackable pointing>
        <Menu.Item name={t('menu.home')} active={activeItem === t('menu.home')} onClick={(e, {name}) => {
            setActiveItem(name);
            clearEnvContext();
            navigation.navigate("/");
        }}/>
        <Dropdown item text={t('menu.forms')}>
            <Dropdown.Menu>
                {_.map(environments, (env) => (
                    <Dropdown.Item icon='cog' text={env.label ? env.label : env.id} onClick={(e, {name}) => {
                        setActiveItem(name);
                        handleClick(env)
                    }}/>
                ))}
            </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position='right'>
            <Menu.Item
                name={t('menu.logout')}
                onClick={() => {
                    secureLS.remove("FORMIO_TOKEN");
                    keycloak.logout()
                }}/>
        </Menu.Menu>
    </Menu>
};

export default AppMenu;
