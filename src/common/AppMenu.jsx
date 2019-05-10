import React, {useContext} from 'react';
import {Dropdown, Icon, Label, Menu} from 'semantic-ui-react';
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

    return <Menu stackable pointing icon='labeled'>
        <Menu.Item name={t('menu.home.name')} active={!state.activeMenuItem || state.activeMenuItem === t('menu.home.name')} onClick={(e, {name}) => {
            setActiveMenuItem(name)
            clearEnvContext();
            navigation.navigate("/");
        }}>
            {t('menu.home.label')}
            <Icon name="home"/>
        </Menu.Item>
        <Dropdown item text={t('menu.forms.label')} icon="wpforms">
            <Dropdown.Menu>

                {_.map(environments, (env) => (
                    <Dropdown.Item icon="cog" key={env.id} text={ envContext ? (envContext.id === env.id ? <Label color='teal' horizontal>
                            {env.label ? env.label : env.id}
                    </Label>: env.label ? env.label : env.id):  env.label ? env.label : env.id} active={envContext? envContext.id === env.id : false} onClick={() => {
                        setActiveMenuItem(t('menu.forms.name'));
                        handleEnvChange(env)
                    }}/>
                ))}
            </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position='right'>
            <Menu.Item
                name={t('menu.logout.name')}
                onClick={() => {
                    clearEnvContext();
                    secureLS.remove("FORMIO_TOKEN");
                    keycloak.logout()
                }}>
                {t('menu.logout.label')}
                <Icon name='log out' />
            </Menu.Item>
        </Menu.Menu>
    </Menu>
};

export default AppMenu;
