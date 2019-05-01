import React, {useState} from 'react';
import {Input, Menu} from 'semantic-ui-react';

const Header = () => {
    const [activeItem, setActiveItem] = useState("home");
    return <div>
        <Menu stackable>
            <Menu.Item name='home' active={activeItem === 'home'} onClick={(e, {name}) => {
                setActiveItem(name)
            }}/>
            <Menu.Item
                name='forms'
                active={activeItem === 'forms'}
                onClick={(e, {name}) => setActiveItem(name)}
            />
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Input icon='search' placeholder='Search...'/>
                </Menu.Item>
                <Menu.Item
                    name='logout'
                    active={activeItem === 'logout'}
                    onClick={(e, {name}) => {
                        setActiveItem(name)
                    }}/>
            </Menu.Menu>

        </Menu>
    </div>
};

export default Header;
