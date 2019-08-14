import React, {useContext, useState} from 'react';
import {useNavigation} from "react-navi";
import {useTranslation} from "react-i18next";
import config from 'react-global-configuration';

import useEnvContext from "../core/context/useEnvContext";
import {ApplicationContext} from "../core/AppRouter";
import eventEmitter from "../core/eventEmitter";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAlt, faCog, faCogs, faHome, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';

const AppMenu = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const {clearEnvContext, changeContext, envContext} = useEnvContext();
    const {state, setState} = useContext(ApplicationContext);

    const [disableMenu, setDisableMenu] = useState(false);

    const handleEnvChange = async (environment) => {
        changeContext(environment);
        await navigation.navigate(`/forms/${environment.id}`, {replace: true});
    };


    const setActiveMenuItem = (name) => {
        setState(state => ({
            ...state,
            activeMenuItem: name
        }))
    };

    eventEmitter.addListener('disable-navigation', () => {
        setTimeout(() => {
            if (disableMenu) {
                setDisableMenu(false)
            }
        }, 60000);
        setDisableMenu(true);
    });

    eventEmitter.addListener('enable-navigation', () => {
        setDisableMenu(false);
    });

    const environments = config.get('environments');

    return <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">

        <Navbar.Brand>Forms Platform</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link
                    disabled={disableMenu}
                    href="#"
                    onClick={async () => {
                        setActiveMenuItem(t('menu.home.name'));
                        clearEnvContext();
                        await navigation.navigate("/");
                    }}
                    active={!state.activeMenuItem || state.activeMenuItem === t('menu.home.name')}
                    data-cy={`home-menu`}><FontAwesomeIcon icon={faHome} color='white'/> Home</Nav.Link>
                <NavDropdown id="collasible-nav-dropdown"
                             active={state.activeMenuItem === t('menu.forms.name')}
                             title={<React.Fragment><FontAwesomeIcon icon={faCogs}
                                                                     color='white'/><span> Environment</span></React.Fragment>}>

                    {_.map(environments, (env) => (
                        <NavDropdown.Item
                            disabled={disableMenu}
                            key={env.id} href="#" data-cy={`${env.id}-form-menu`}
                            active={envContext ? envContext.id === env.id : false}
                            onClick={async () => {
                                setActiveMenuItem(t('menu.forms.name'));
                                await handleEnvChange(env)
                            }}>
                            <FontAwesomeIcon icon={faCog}/> <span>{env.label ? env.label : env.id}</span>
                        </NavDropdown.Item>))
                    }
                </NavDropdown>
                {config.get('legacy-migration', false) ?
                    <Nav.Link
                        disabled={disableMenu}
                        data-cy="migration"
                        active={state.activeMenuItem === t('menu.migration.name')}
                        onClick={async () => {
                            setActiveMenuItem(t('menu.migration.name'));
                            await navigation.navigate("/migrations");
                        }}
                    ><FontAwesomeIcon icon={faArrowsAlt} color='white'/> {t('menu.migration.label')}</Nav.Link>
                    : null}

            </Nav>

            <Nav>
                <Nav.Link
                    disabled={disableMenu}
                    onClick={async () => {
                        await navigation.navigate("/logout");
                    }} data-cy="logout"
                    href="#"><FontAwesomeIcon icon={faSignOutAlt} color='white'/> {t('menu.logout.label')}</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>


    // return <Menu pointing secondary>
    //     <Menu.Item disabled={disableMenu} data-cy={`home-menu`} name={t('menu.home.name')}
    //                active={!state.activeMenuItem || state.activeMenuItem === t('menu.home.name')}
    //                onClick={(e, {name}) => {
    //                    setActiveMenuItem(name);
    //                    clearEnvContext();
    //                    navigation.navigate("/");
    //                }}>
    //         <Icon name="home" size="large" style={iconStyle}/>
    //         <span>{t('menu.home.label')}</span>
    //     </Menu.Item>
    //
    //     <Menu.Item
    //         disabled={disableMenu} data-cy={`forms-menu`}
    //         name={t('menu.forms.name')}
    //         active={state.activeMenuItem === t('menu.forms.name')}>
    //         <Dropdown trigger={formsMenu} disabled={disableMenu}>
    //             <Dropdown.Menu>
    //                 <Dropdown.Header>{t('home.environments')}</Dropdown.Header>
    //                 {_.map(environments, (env) => (
    //                     <Dropdown.Item data-cy={`${env.id}-form-menu`} key={env.id}
    //                                    active={envContext ? envContext.id === env.id : false} onClick={() => {
    //                         setActiveMenuItem(t('menu.forms.name'));
    //                         handleEnvChange(env)
    //                     }}>
    //                         <Icon name="cog"/><span>{env.label ? env.label : env.id}</span>
    //                     </Dropdown.Item>
    //                 ))}
    //
    //             </Dropdown.Menu>
    //         </Dropdown>
    //
    //     </Menu.Item>
    //
    //     {config.get('legacy-migration', false) ? <Menu.Item disabled={disableMenu}
    //         active={state.activeMenuItem === t('menu.migration.name')}
    //         name={t('menu.migration.name')}
    //         onClick={async () => {
    //             setActiveMenuItem(t('menu.migration.name'));
    //             await navigation.navigate("/migrations");
    //         }} data-cy="migration">
    //         <Icon name='move' size="large" style={iconStyle}/>
    //         <span>{t('menu.migration.label')}</span>
    //     </Menu.Item> : null}
    //
    //     <Menu.Menu position='right'>
    //         <Menu.Item  disabled={disableMenu}
    //             name={t('menu.logout.name')}
    //             onClick={() => {
    //                 navigation.navigate("/logout");
    //             }} data-cy="logout">
    //             <Icon name='log out' size="large" style={iconStyle}/>
    //             <span>{t('menu.logout.label')}</span>
    //         </Menu.Item>
    //     </Menu.Menu>
    // </Menu>
};

export default AppMenu;
