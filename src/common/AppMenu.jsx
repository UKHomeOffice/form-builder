import React, {useState} from 'react';
import {Menu} from 'semantic-ui-react';
import {useKeycloak} from 'react-keycloak';
import {useCurrentRoute, useNavigation} from "react-navi";

const AppMenu = () => {
    const route = useCurrentRoute();
    const navigation = useNavigation();
    const [keycloak] = useKeycloak();

    const path = route.url.pathname;
    const [activeItem, setActiveItem] = useState(path === '/' ? "/home": path);

    return <Menu stackable pointing>
        <Menu.Item name='/home' active={activeItem === "/home"} onClick={(e, {name}) => {
            setActiveItem(name);
            navigation.navigate("/");
        }}/>
        <Menu.Item
            name='/forms'
            active={ activeItem.startsWith("/form")}
            onClick={(e, {name}) => {
                setActiveItem(name);
                navigation.navigate(name);
            }}
        />
        <Menu.Menu position='right'>
            <Menu.Item
                name='logout'
                onClick={() => {
                    keycloak.logout()
                }}/>
        </Menu.Menu>
    </Menu>
};

export default AppMenu;