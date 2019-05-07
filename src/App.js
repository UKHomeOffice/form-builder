import React from 'react';
import './App.scss';
import {AppRouter} from "./core/AppRouter";
import Keycloak from 'keycloak-js';
import {KeycloakProvider} from 'react-keycloak';
import {Provider} from "react-redux";
import configureStore from './core/configureStore'
import {Loader} from "semantic-ui-react";

const store = configureStore();

const keycloak = new Keycloak({
    "realm": process.env.REACT_APP_AUTH_REALM,
    "url": process.env.REACT_APP_AUTH_URL,
    "clientId": process.env.REACT_APP_AUTH_CLIENT_ID
});

const removeFormioToken = () => {
    localStorage.removeItem("FORMIO_TOKEN");
};
keycloak.onAuthLogout = () => {
    removeFormioToken();
};

keycloak.onTokenExpired = () => {
    removeFormioToken();
};

export const App = () => (
    <KeycloakProvider keycloak={keycloak} initConfig={{
        onLoad: 'login-required',
        checkLoginIframe: false,
    }} LoadingComponent={() => <Loader active inline='centered' size='large'>Loading</Loader>}>
        <Provider store={store}>
            <AppRouter/>
        </Provider>
    </KeycloakProvider>
);
