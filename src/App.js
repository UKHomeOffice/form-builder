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
import configuration from './config/appConfig';
import eventEmitter from './core/eventEmitter';


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
                          if (event === 'onTokenExpired') {
                              keycloak.updateToken(120).success(() => {
                                  console.log('Token refreshed after minValidity');
                              }).error(() =>{
                                  keycloak.logout();
                              });
                          }
                      }}
                      onTokens={(tokens) => {
                          console.log("token refreshed");
                          const token = tokens.token;
                          secureLS.set("jwt-token", token);
                          eventEmitter.emit('token-refreshed', token);
                      }}
                      initConfig={{
                          onLoad: 'login-required'
                      }} LoadingComponent={() => <Loader active inline='centered' size='large'>Loading</Loader>}>
        <Provider store={store}>
            <AppRouter/>
        </Provider>
    </KeycloakProvider>
);
