import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import useEnvContext from "../context/useEnvContext";
import useLogger from "../logging/useLogger";
import {KeycloakTokenProvider} from "../KeycloakTokenProvider";
import secureLS from "../storage";
import {useKeycloak} from "react-keycloak";
import axiosRetry from 'axios-retry';

const keycloakTokenProvider = new KeycloakTokenProvider();

const configureAxios = async (envContext, config, keycloak) => {
    if (envContext) {
        const token = secureLS.get("jwt-token");
        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        config.headers['Cache-Control'] = "no-cache";
        config.headers['x-user-email'] = keycloak.tokenParsed.email;
        if (config.headers['x-promote-kc-token']) {
            config.headers.Authorization = config.headers['x-promote-kc-token'];
            delete config.headers['x-promote-kc-token'];
        } else {
            const jwtToken = await keycloakTokenProvider.fetchKeycloakToken(envContext, token);
            config.headers['Authorization'] = `Bearer ${jwtToken}`;
        }
    }
    return Promise.resolve(config);
};


const useApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const [keycloak] = useKeycloak();

    axiosRetry(instance, { retries: 3 });

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
            console.log(err.stack);
            if (axios.isCancel(err)) {
                console.log(err.message);
            } else {
                dispatch(error(err.response, err));
            }
        }
    };

    return [state, makeRequest];
};


export const useMultipleApiCallbackRequest = (apiCallback, logBefore = null, logAfter = null) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const {log} = useLogger();
    const [keycloak] = useKeycloak();

    axiosRetry(instance, { retries: 3 });

    instance.interceptors.request.use(async (config) =>
            configureAxios(envContext, config, keycloak),
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
