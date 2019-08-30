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
import {useToasts} from "react-toast-notifications";


const AppMenu = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const {addToast} = useToasts();
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

    eventEmitter.subscribe('disable-navigation', () => {
        setTimeout(() => {
            if (disableMenu) {
                setDisableMenu(false)
            }
        }, 60000);
        setDisableMenu(true);
    });

    eventEmitter.subscribe('enable-navigation', () => {
        setDisableMenu(false);
    });


    eventEmitter.subscribeOnce('error', error => {
        const response = error.response;
        const exception = error.exception;
        const message = error.message;
        const options = {
            appearance: 'error',
            autoDismiss: true,
            pauseOnHover: true
        };
        if (message) {
            addToast(`${t('error.general')}: ${message}`,
                options);
        } else if (exception) {
            addToast(`${t('error.general')}: ${exception.message}`,
                options);
        } else {
            let errorMessage = '';

            if (response) {
                if (response.data['validationErrors']) {
                    response.data['validationErrors'].forEach((validationError) => {
                        errorMessage += validationError.message + "\n";
                    });
                } else {
                    errorMessage = response.data.exception ? response.data.exception : response.data.message;
                }
            } else {
                errorMessage = "Failed to reach API Server"
            }

            addToast(`${t('error.general')}: ${errorMessage}`,
                options);
        }
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
                    data-cy={`home-menu`}><FontAwesomeIcon icon={faHome} color='white'/><span
                    className="ml-2">Home</span></Nav.Link>
                <NavDropdown id="collasible-nav-dropdown"
                             active={state.activeMenuItem === t('menu.forms.name')}
                             title={<React.Fragment><FontAwesomeIcon icon={faCogs}
                                                                     color='white'/><span
                                 className="ml-2">Environment</span></React.Fragment>}>

                    {_.map(environments, (env) => (
                        <NavDropdown.Item
                            disabled={disableMenu}
                            key={env.id} href="#" data-cy={`${env.id}-form-menu`}
                            active={envContext ? envContext.id === env.id : false}
                            onClick={async () => {
                                setActiveMenuItem(t('menu.forms.name'));
                                await handleEnvChange(env)
                            }}>
                            <FontAwesomeIcon icon={faCog}/> <span
                            className="ml-2">{env.label ? env.label : env.id}</span>
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
                    ><FontAwesomeIcon icon={faArrowsAlt} color='white'/> <span
                        className="ml-1">{t('menu.migration.label')}</span></Nav.Link>
                    : null}

            </Nav>

            <Nav>
                <Nav.Link
                    disabled={disableMenu}
                    onClick={async () => {
                        await navigation.navigate("/logout");
                    }} data-cy="logout"
                    href="#"><FontAwesomeIcon icon={faSignOutAlt} color='white'/><span
                    className="ml-2">{t('menu.logout.label')}</span></Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
};

export default AppMenu;
