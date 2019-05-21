import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import {useKeycloak} from "react-keycloak";
import secureLS from '../storage';
import useEnvContext from "../context/useEnvContext";
import jwt_decode from 'jwt-decode';
import useLogger from "../logging/useLogger";


const getFormioToken = async (envContext, keycloakToken) => {
    const tokenResponse = await axios({
        url: `/formio/${envContext.id}/token`,
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${keycloakToken}`,
            "Content-Type": "application/json"
        }
    });
    return tokenResponse.data['x-jwt-token'];
};

const configureAxios = async (envContext, config, keycloak) => {
    const token = keycloak.token;
    config.headers['accept'] = 'application/json';
    config.headers['content-type'] = 'application/json';
    if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const jwtTokenFromSecureLS = secureLS.get("FORMIO_TOKEN");
    let formioToken;
    if (!jwtTokenFromSecureLS) {
        formioToken = await getFormioToken(envContext, token);
        secureLS.set("FORMIO_TOKEN", formioToken);
    } else {
        if (jwt_decode(jwtTokenFromSecureLS).exp < new Date().getTime() / 1000) {
            formioToken = await getFormioToken(envContext, token);
            secureLS.set("FORMIO_TOKEN", formioToken);
        } else {
            formioToken = jwtTokenFromSecureLS;
        }
    }
    config.headers['x-jwt-token'] = formioToken;
    return Promise.resolve(config);
};


const useApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [keycloak] = useKeycloak();
    const instance = axios.create();
    const {envContext} = useEnvContext();


    instance.interceptors.request.use(async (config) => configureAxios(envContext, config, keycloak),
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
    const [keycloak] = useKeycloak();
    const instance = axios.create();
    const {envContext} = useEnvContext();
    const {log} = useLogger();

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
