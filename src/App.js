import React from 'react';
import './App.scss';
import {AppRouter} from "./core/routes";
import Keycloak from 'keycloak-js';
import {KeycloakProvider} from 'react-keycloak';
import {Provider} from "react-redux";
import {Formio} from 'react-formio';
import configureStore from './core/configureStore'
import {Loader} from "semantic-ui-react";

const store = configureStore();
Formio.setProjectUrl(process.env.REACT_APP_FORMIO_URL);
Formio.setBaseUrl(process.env.REACT_APP_FORMIO_URL);


const keycloak = new Keycloak({
    "realm": process.env.REACT_APP_AUTH_REALM,
    "url": process.env.REACT_APP_AUTH_URL,
    "clientId": process.env.REACT_APP_AUTH_CLIENT_ID
});

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
