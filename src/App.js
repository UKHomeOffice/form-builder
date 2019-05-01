import React, {Suspense} from 'react';
import './App.scss';
import {Router, View} from "react-navi";
import routes from "./core/routes";
import {Main} from "./core/Main";
import Keycloak from 'keycloak-js';
import {KeycloakProvider} from 'react-keycloak';

const keycloak = new Keycloak({
    "realm": process.env.REACT_APP_AUTH_REALM,
    "url": process.env.REACT_APP_AUTH_URL,
    "clientId": process.env.REACT_APP_AUTH_CLIENT_ID
});

export const App = () => (
    <KeycloakProvider keycloak={keycloak} initConfig={{
        onLoad: 'login-required'
    }} LoadingComponent={() => <div>Loading</div>}>
        <Router routes={routes}>
            <Main>
                <Suspense fallback={null}>
                    <View/>
                </Suspense>
            </Main>
        </Router>
    </KeycloakProvider>
);
