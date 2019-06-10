import React from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary, useCurrentRoute} from "react-navi";
import Notification from "../common/Notification";
import AppHeader from "../common/AppHeader";
import {Container, Message} from "semantic-ui-react";
import config from 'react-global-configuration'
import {useTranslation} from "react-i18next";

export const Main = ({children}) => {
    const route = useCurrentRoute();
    const {t} = useTranslation();

    const pageNotFound = () => {
        return <Container><Message negative size='massive'>
            <Message.Header>404</Message.Header>
            <p>{t('error.not-found')}</p>
        </Message></Container>
    };
    if (!config.get('gov-uk-enabled', false)) {
        return <React.Fragment>
            <AppMenu/>
            <Container>
                <AppHeader/>
                <Notification/>
            </Container>
            <NavNotFoundBoundary render={pageNotFound}>
                {children || null}
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
                    <Notification/>
                </Container></React.Fragment> : null
        }
        <NavNotFoundBoundary render={pageNotFound}>
            {children || null}
        </NavNotFoundBoundary>
        <Footer/>
    </React.Fragment>
};
