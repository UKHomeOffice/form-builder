import React, {useContext} from 'react';
import {Dropdown, Icon, Menu} from 'semantic-ui-react';
import {useKeycloak} from 'react-keycloak';
import {useNavigation} from "react-navi";
import {useTranslation} from "react-i18next";
import _ from 'lodash';
import environments from '../environments';
import useEnvContext from "../core/context/useEnvContext";
import {ApplicationContext} from "../core/Main";
import secureLS from "../core/storage";

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

    const iconStyle = {
        margin: '0 10px 0 0'
    };

    const setActiveMenuItem = (name) => {
        setState(state => ({
            ...state,
            activeMenuItem: name
        }))
    };

    return <Menu pointing secondary>
        <Menu.Item data-cy={`home-menu`} name={t('menu.home.name')}
                   active={!state.activeMenuItem || state.activeMenuItem === t('menu.home.name')}
                   onClick={(e, {name}) => {
                       setActiveMenuItem(name);
                       clearEnvContext();
                       navigation.navigate("/");
                   }}>
            <Icon name="home" size="large" style={iconStyle}/>
            <span>{t('menu.home.label')}</span>
        </Menu.Item>

        <Menu.Item
            data-cy={`forms-menu`}
            name={t('menu.forms.name')}
            active={state.activeMenuItem === t('menu.form.name')}>
            <Icon name="wpforms" size="large" style={iconStyle}/>
            <span>{t('menu.forms.label')}</span>
            <Dropdown>
                <Dropdown.Menu>
                    <Dropdown.Header>{t('home.environments')}</Dropdown.Header>
                    {_.map(environments, (env) => (
                        <Dropdown.Item data-cy={`${env.id}-form-menu`} key={env.id}
                                       active={envContext ? envContext.id === env.id : false} onClick={() => {
                            setActiveMenuItem(t('menu.forms.name'));
                            handleEnvChange(env)
                        }}>
                            <Icon name="cog"/><span>{env.label ? env.label : env.id}</span>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
        <Menu.Menu position='right'>
            <Menu.Item
                name={t('menu.logout.name')}
                onClick={() => {
                    secureLS.remove("FORMIO_TOKEN");
                    secureLS.remove("ENVIRONMENT");
                    keycloak.logout();
                }} data-cy="logout">

                <Icon name='log out' size="large" style={iconStyle}/>
                <span>{t('menu.logout.label')}</span>
            </Menu.Item>
        </Menu.Menu>
    </Menu>
};

export default AppMenu;
