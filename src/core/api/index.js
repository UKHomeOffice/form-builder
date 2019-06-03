import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import useEnvContext from "../context/useEnvContext";
import useLogger from "../logging/useLogger";
import {KeycloakTokenProvider} from "../KeycloakTokenProvider";
import FormioTokenProvider from "../form/FormioTokenProvider";
import secureLS from "../storage";

const keycloakTokenProvider = new KeycloakTokenProvider();
const formioTokenProvider = new FormioTokenProvider();


const configureAxios = async (envContext, config) => {
    const token = secureLS.get("jwt-token");
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers['Cache-Control'] = "no-cache";
    if (config.headers['x-promote-kc-token']) {
        config.headers.Authorization = config.headers['x-promote-kc-token'];
        delete config.headers['x-promote-kc-token'];
    } else {
        const jwtToken = await keycloakTokenProvider.fetchKeycloakToken(envContext, token);
        config.headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    if (config.headers['x-promote-formio-token']) {
        config.headers['x-jwt-token'] = config.headers['x-promote-formio-token'];
        delete config.headers['x-promote-formio-token'];
    } else {
        config.headers['x-jwt-token'] = await formioTokenProvider.fetchToken(envContext, token);
    }
    return Promise.resolve(config);
};


const useApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();


    instance.interceptors.request.use(async (config) => configureAxios(envContext, config),
        (err) => {
            return Promise.reject(err);
        });

    const makeRequest = async () => {
        dispatch(executing());
        try {
            const response = await instance[verb](`${envContext.url}${path}`, params);
            dispatch(success(response));
        } catch ({response = null, ...exception}) {
            dispatch(error(response, exception));
        }
    };

    return [state, makeRequest];
};


export const useMultipleApiCallbackRequest = (apiCallback, logBefore = null, logAfter = null) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const {log} = useLogger();

    instance.interceptors.request.use(async (config) =>
            configureAxios(envContext, config),
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
