import React from 'react';
import './App.scss';
import {AppRouter} from "./core/AppRouter";
import Keycloak from 'keycloak-js';
import {KeycloakProvider} from 'react-keycloak';
import {Provider} from "react-redux";
import configureStore from './core/configureStore'
import {Loader} from "semantic-ui-react";
import secureLS from './core/storage';
import config from 'react-global-configuration';
import configuration from './config';

window.ENVIRONMENT_CONFIG = configuration;

config.set(window.ENVIRONMENT_CONFIG);

const store = configureStore();

const keycloak = new Keycloak({
    "realm": config.get("keycloak.realm"),
    "url": config.get("keycloak.authUrl"),
    "clientId": config.get("keycloak.clientId")
});

const clearSecureLocalStorage = () => {
    secureLS.remove("FORMIO_TOKEN");
    secureLS.remove("ENVIRONMENT");
};

keycloak.onTokenExpired = () => {
    clearSecureLocalStorage();
};

keycloak.onAuthError = () => {
    clearSecureLocalStorage();
};


export const App = () => (
    <KeycloakProvider keycloak={keycloak} initConfig={{
        onLoad: 'login-required'
    }} LoadingComponent={() => <Loader active inline='centered' size='large'>Loading</Loader>}>
        <Provider store={store}>
            <AppRouter/>
        </Provider>
    </KeycloakProvider>
);
