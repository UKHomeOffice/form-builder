import React, {useState} from 'react';
import {Menu} from 'semantic-ui-react';
import {useKeycloak} from 'react-keycloak';
import {useCurrentRoute, useNavigation} from "react-navi";
import {useTranslation} from "react-i18next";

const AppMenu = () => {
    const route = useCurrentRoute();
    const navigation = useNavigation();
    const {t} = useTranslation();
    const [keycloak] = useKeycloak();

    const path = route.url.pathname;
    const [activeItem, setActiveItem] = useState(path === '/' ? t('menu.home'): path);

    return <Menu stackable pointing>
        <Menu.Item name={t('menu.home')} active={activeItem === t('menu.home')} onClick={(e, {name}) => {
            setActiveItem(name);
            navigation.navigate("/");
        }}/>
        <Menu.Item
            name={t('menu.forms')}
            active={ activeItem.startsWith(t('menu.forms'))}
            onClick={(e, {name}) => {
                setActiveItem(name);
                navigation.navigate(name);
            }}
        />
        <Menu.Menu position='right'>
            <Menu.Item
                name={t('menu.logout')}
                onClick={() => {
                    localStorage.removeItem("FORMIO_TOKEN");
                    keycloak.logout()
                }}/>
        </Menu.Menu>
    </Menu>
};

export default AppMenu;
