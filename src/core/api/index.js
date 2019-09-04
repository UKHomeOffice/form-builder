import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import useEnvContext from "../context/useEnvContext";
import useLogger from "../logging/useLogger";
import {useKeycloak} from "react-keycloak";
import keycloakTokenProvider from '../KeycloakTokenProvider';

const configureAxios = async (envContext, config, keycloak) => {
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers['Cache-Control'] = "no-cache";
    config.headers['x-user-email'] = keycloak.tokenParsed.email;
    if (config.headers['x-promote-kc-token']) {
        config.headers.Authorization = config.headers['x-promote-kc-token'];
        delete config.headers['x-promote-kc-token'];
    } else {
        const jwtToken = await keycloakTokenProvider.fetchKeycloakToken(envContext, keycloak);
        config.headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    return Promise.resolve(config);
};

const useApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const [keycloak] = useKeycloak();
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


export const useMultipleApiCallbackRequest = (apiCallback, logBefore = null, logAfter = null, env = null) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const {log} = useLogger();
    const [keycloak] = useKeycloak();

    const environment = env ? env : envContext;

    instance.interceptors.request.use(async (config) =>
            configureAxios(environment, config, keycloak),
        (err) => {
            return Promise.reject(err);
        });

    const execute = async () => {
        if (logBefore) {
            log(logBefore);
        }
        dispatch(executing());
        try {
            const response = await apiCallback(instance);
            if (logAfter) {
                log(logAfter);
            }
            dispatch(success(response));
        } catch ({response = null, ...exception}) {
            log([{
                message: "An error occurred",
                exception,
                response,
                level: 'error'
            }]);
            dispatch(error(response, exception));
        }
    };
    return [state, execute];
};


export default useApiRequest;
