import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import useEnvContext from "../context/useEnvContext";
import {useKeycloak} from "react-keycloak";
import keycloakTokenProvider from '../auth/KeycloakTokenProvider';
import qs from "querystring";
import appConfig from 'react-global-configuration';


const configureAxios = async (envContext, config, keycloak) => {
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers['Cache-Control'] = "no-cache";
    config.headers['x-user-email'] = keycloak.tokenParsed.email;
    const jwtToken = await keycloakTokenProvider.fetchKeycloakToken(envContext, keycloak);
    config.headers['Authorization'] = `Bearer ${jwtToken}`;
    return Promise.resolve(config);
};

export const useProxyApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const [keycloak] = useKeycloak();
    const keycloakConfig = appConfig.get('keycloak');

    instance.interceptors.request.use(async (config) => {
            config.headers['x-user-email'] = keycloak.tokenParsed.email;
            const accessToken = await axios({
                method: 'POST',
                url: `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: qs.stringify({
                    grant_type: 'refresh_token',
                    client_id: keycloakConfig.clientId,
                    refresh_token: keycloak.refreshToken
                })
            });
            config.headers['Authorization'] = `Bearer ${accessToken.data.access_token}`;
            return Promise.resolve(config);
        },
        (err) => {
            return Promise.reject(err);
        });

    const makeRequest = async () => {
        dispatch(executing());
        let response;
        try {
            response = await instance[verb](`${path}`, params);
            dispatch(success(response));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(err.message);
            } else {
                dispatch(error(err.response, err));
            }
        }
    };


    return [state, makeRequest];
};

const useApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const [keycloak] = useKeycloak();

    instance.interceptors.response.use(response => {
        return response;
    }, async error => {
        return handleError(instance, error, keycloak);
    });
    instance.interceptors.request.use(async (config) => configureAxios(envContext, config, keycloak),
        (err) => {
            return Promise.reject(err);
        });

    const makeRequest = async () => {
        dispatch(executing());
        let response;
        try {
            response = await instance[verb](`${envContext.url}${path}`, params);
            dispatch(success(response));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(err.message);
            } else {
                dispatch(error(err.response, err));
            }
        }
    };


    return [state, makeRequest];
};

const handleError = async (instance, error, keycloak) => {
    const keycloakConfig = appConfig.get('keycloak');
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        console.log("Retrying..." + error.response.status);
        let response;
        try {
            response = await axios({
                method: 'POST',
                url: `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: qs.stringify({
                    grant_type: 'refresh_token',
                    client_id: keycloakConfig.clientId,
                    refresh_token: keycloak.refreshToken
                })
            });
        } catch (e) {
            console.error(e);
        }
        console.log("Got new token");
        const token = response.data.access_token;
        const config = error.config;
        config.headers['Authorization'] = `Bearer ${token}`;
        return new Promise((resolve, reject) => {
            instance.request(config).then(response => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            });
        });
    } else {
        return Promise.reject(error);
    }
};

export default useApiRequest;
