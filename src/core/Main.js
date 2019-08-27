import React, {useState} from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary, useCurrentRoute} from "react-navi";
import AppHeader from "../common/AppHeader";
import config from 'react-global-configuration'
import {useTranslation} from "react-i18next";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import eventEmitter from "./eventEmitter";
import {useToasts} from "react-toast-notifications";

export const Main = ({children}) => {
    const route = useCurrentRoute();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const {addToast} = useToasts();

    //centralise errors
    eventEmitter.addListener('error', error => {
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
            //TODO: Handle response errors
        }
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
                </Container></React.Fragment> : null
        }
        <NavNotFoundBoundary render={pageNotFound}>
            {children || null}
        </NavNotFoundBoundary>
        <Footer/>
    </React.Fragment>
};
