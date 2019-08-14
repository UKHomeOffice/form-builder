import React, {useState} from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary, useCurrentRoute} from "react-navi";
import Notification from "../common/Notification";
import AppHeader from "../common/AppHeader";
import config from 'react-global-configuration'
import {useTranslation} from "react-i18next";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

export const Main = ({children}) => {
    const route = useCurrentRoute();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
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
