import React from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary, useCurrentRoute} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import Notification from "../common/Notification";
import AppHeader from "../common/AppHeader";
import {Container} from "semantic-ui-react";
import config from 'react-global-configuration'

export const Main = ({children}) => {
    const route = useCurrentRoute();
    if (!config.get('gov-uk-enabled', false)) {
        return <React.Fragment>
            <AppMenu/>
            <Container>
                <AppHeader/>
                <Notification/>
            </Container>
            <NavNotFoundBoundary render={PageNotFound}>
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
        <NavNotFoundBoundary render={PageNotFound}>
            {children || null}
        </NavNotFoundBoundary>
        <Footer/>
    </React.Fragment>
};
