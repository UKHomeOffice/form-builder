import React, {useContext} from 'react';
import {Dropdown, Menu} from 'semantic-ui-react';
import {useKeycloak} from 'react-keycloak';
import {useNavigation} from "react-navi";
import {useTranslation} from "react-i18next";
import secureLS from '../core/storage';
import _ from 'lodash';
import environments from '../environments';
import useEnvContext from "../core/context/useEnvContext";
import {ApplicationContext} from "../core/Main";

const AppMenu = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const [keycloak] = useKeycloak();
    const {clearEnvContext, changeContext, envContext} = useEnvContext();
    const {state, setState} = useContext(ApplicationContext);

    const handleEnvChange = (environment) => {
        changeContext(environment);
        navigation.navigate(`/forms/${environment.id}`, {replace: true});
    };

    const setActiveMenuItem = (name) => {
        setState(state => ({
            ...state,
            activeMenuItem : name
        }))
    };

    return <Menu stackable pointing>
        <Menu.Item name={t('menu.home')} active={!state.activeMenuItem || state.activeMenuItem === t('menu.home')} onClick={(e, {name}) => {
            setActiveMenuItem(name)
            clearEnvContext();
            navigation.navigate("/");
        }}/>
        <Dropdown item text={t('menu.forms')}>
            <Dropdown.Menu>
                {_.map(environments, (env) => (
                    <Dropdown.Item key={env.id} icon='cog' text={env.label ? env.label : env.id} active={envContext? envContext.id === env.id : false} onClick={() => {
                        setActiveMenuItem(t('menu.forms'));
                        handleEnvChange(env)
                    }}/>
                ))}
            </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position='right'>
            <Menu.Item
                name={t('menu.logout')}
                onClick={() => {
                    clearEnvContext();
                    secureLS.remove("FORMIO_TOKEN");
                    keycloak.logout()
                }}/>
        </Menu.Menu>
    </Menu>
};

export default AppMenu;
