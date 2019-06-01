import React, {useContext} from 'react';
import {Dropdown, Icon, Menu} from 'semantic-ui-react';
import {useNavigation} from "react-navi";
import {useTranslation} from "react-i18next";
import _ from 'lodash';
import config from 'react-global-configuration';

import useEnvContext from "../core/context/useEnvContext";
import {ApplicationContext} from "../core/AppRouter";

const AppMenu = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();
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
    const environments = config.get('environments');
    const formsMenu = <React.Fragment><Icon name="wpforms" size="large" style={iconStyle}/><span>{t('menu.forms.label')}</span></React.Fragment>;
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
            active={state.activeMenuItem === t('menu.forms.name')}>
            <Dropdown trigger={formsMenu}>
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
                    navigation.navigate("/logout");
                }} data-cy="logout">

                <Icon name='log out' size="large" style={iconStyle}/>
                <span>{t('menu.logout.label')}</span>
            </Menu.Item>
        </Menu.Menu>
    </Menu>
};

export default AppMenu;
