import React, {useState} from 'react';
import {Input, Menu} from 'semantic-ui-react';
import {useKeycloak} from 'react-keycloak';

const Header = () => {
    const [keycloak] = useKeycloak();
    const [activeItem, setActiveItem] = useState("/home");
    return <Menu stackable pointing>
        <Menu.Item name='/home' active={activeItem === '/home'} onClick={(e, {name}) => {
            setActiveItem(name)
        }}/>
        <Menu.Item
            name='/forms'
            active={activeItem === '/forms'}
            onClick={(e, {name}) => setActiveItem(name)}
        />
        <Menu.Menu position='right'>
            <Menu.Item>
                <Input icon='search' placeholder='Search...'/>
            </Menu.Item>
            <Menu.Item
                name='logout'
                active={activeItem === '/logout'}
                onClick={() => {
                    keycloak.logout()
                }}/>
        </Menu.Menu>

    </Menu>
};

export default Header;
