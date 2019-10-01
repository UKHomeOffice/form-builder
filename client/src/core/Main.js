import React, {useEffect, useState, useRef} from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary, useCurrentRoute} from "react-navi";
import AppHeader from "../common/AppHeader";
import config from 'react-global-configuration'
import {useTranslation} from "react-i18next";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import ErrorHandling from "../common/ErrorHandling";
import {useKeycloak} from "react-keycloak";
import jwt_decode from "jwt-decode";

export const Main = ({children}) => {
    const route = useCurrentRoute();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const {keycloak} = useKeycloak();

    const refreshTokenCheckRef = useRef();

    const refreshTokenCheckCallback = () => {
        const events = [
            'load',
            'click',
            'scroll',
            'keypress'
        ];
        events.forEach((eventType) => {
            document.addEventListener(eventType, (e) => {
                const isExpired = jwt_decode(keycloak.refreshToken).exp < new Date().getTime() / 1000;
                if (isExpired) {
                    keycloak.logout();
                }
            });
        });
    };

    useEffect(() => {
        refreshTokenCheckRef.current = refreshTokenCheckCallback;
    });

    useEffect(() => {
        refreshTokenCheckRef.current();
    });

    const pageNotFound = () => {
        return <Container>
            <div style={{'paddingTop': '20px'}}>
                <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>URL not found</Alert.Heading>
                    <p>
                        {t('error.not-found')}
                    </p>
                </Alert>
            </div>
        </Container>
    };
    if (!config.get('gov-uk-enabled', false)) {
        return <React.Fragment>
            <AppMenu/>
            <Container>
                <AppHeader/>
            </Container>
            <NavNotFoundBoundary render={pageNotFound}>
                <ErrorHandling>{children || null}</ErrorHandling>
            </NavNotFoundBoundary>
            <Footer/>
        </React.Fragment>
    }
    const isGovUKUrl = route.url.pathname.endsWith("/gov-uk");

    return <React.Fragment>
        {
            !isGovUKUrl ? <React.Fragment> <AppMenu/>
                <Container>
                    <AppHeader/>
                </Container></React.Fragment> : null
        }
        <NavNotFoundBoundary render={pageNotFound}>
            <ErrorHandling>{children || null}</ErrorHandling>
        </NavNotFoundBoundary>
        <Footer/>
    </React.Fragment>
};
