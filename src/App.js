import React from 'react';
import './App.scss';
import {AppRouter} from "./core/AppRouter";
import Keycloak from 'keycloak-js';
import {KeycloakProvider} from 'react-keycloak';
import {Provider} from "react-redux";
import configureStore from './core/configureStore'
import secureLS from './core/storage';
import config from 'react-global-configuration';
import configuration from './config/appConfig';
import eventEmitter from './core/eventEmitter';
import Spinner from "react-bootstrap/Spinner";
import {ToastProvider} from 'react-toast-notifications'

if (window.ENVIRONMENT_CONFIG) {
    console.log("Using built version of application");
    config.set(window.ENVIRONMENT_CONFIG);
} else {
    console.log("Using non-built version of application");
    config.set(configuration);
}

const store = configureStore();

const keycloak = new Keycloak({
    "realm": config.get("keycloak.realm"),
    "url": config.get("keycloak.authUrl"),
    "clientId": config.get("keycloak.clientId")
});

const clearSecureLocalStorage = () => {
    secureLS.removeAll();
};

export const App = () => (

    <KeycloakProvider keycloak={keycloak}
                      onEvent={(event) => {
                          if (event === 'onAuthLogout' || event === 'onAuthError') {
                              clearSecureLocalStorage();
                          }
                      }}
                      onTokens={(tokens) => {
                          const token = tokens.token;
                          eventEmitter.publish('token-refreshed', token);
                      }}
                      initConfig={{
                          onLoad: 'login-required'
                      }} LoadingComponent={() => <div className="center">
        <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    </div>}>
        <Provider store={store}>
            <ToastProvider
                autoDismissTimeout={5000}
                placement={'top-center'}>
                <AppRouter/>
            </ToastProvider>
        </Provider>
    </KeycloakProvider>
);
