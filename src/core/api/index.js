import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import useEnvContext from "../context/useEnvContext";
import useLogger from "../logging/useLogger";
import {KeycloakTokenProvider} from "../KeycloakTokenProvider";
import {useKeycloak} from "react-keycloak";
import jwt_decode from "jwt-decode";

const keycloakTokenProvider = new KeycloakTokenProvider();

const configureAxios = async (envContext, config, keycloak) => {
    const token = keycloak.token;
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

    return Promise.resolve(config);
};

const handleError = async (instance, error, keycloak, envContext) => {
    if (error.response) {
        const isExpired = jwt_decode(error.response.config.headers['Authorization'].replace('Bearer', '')).exp < new Date().getTime() / 1000;
        if ((error.response.status ===  403 || error.response.status === 401) && isExpired) {
            window.reload();
            console.log("Trying again");
            Object.assign(instance.defaults, configureAxios(envContext, instance.defaults, keycloak));
            Object.assign(error.response.config, configureAxios(envContext, instance.defaults, keycloak));
            return await instance.request(error.response.config);
        } else {
            return Promise.reject(error);
        }
    } else {
        return Promise.reject(error);
    }
}

const useApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const [keycloak] = useKeycloak();
    instance.interceptors.request.use(async (config) => configureAxios(envContext, config, keycloak),
        (err) => {
            return Promise.reject(err);
        });

    instance.interceptors.response.use(response => {
        return response;
    }, async error => {
        return handleError(instance, error, keycloak, envContext);
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

    instance.interceptors.response.use(response => {
        return response;
    }, async error => {
        return handleError(instance, error, keycloak, envContext);
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
