import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import {useKeycloak} from "react-keycloak";
import secureLS from '../storage';
import useEnvContext from "../context/useEnvContext";
import jwt_decode from 'jwt-decode';

const useApiRequest = (path, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [keycloak] = useKeycloak();
    const instance = axios.create();
    const {envContext} = useEnvContext();

    const baseUrl = envContext.url;
    const username = envContext.service.formio.username;
    const password = envContext.service.formio.password;

    const getToken = async (username, password) => {
        const tokenResponse = await axios.post(`${baseUrl}/user/login`, {
            data: {
                email: username,
                password: password
            }
        });
        return tokenResponse.headers['x-jwt-token'];
    };

    instance.interceptors.request.use(async (config) => {
        const token = keycloak.token;
        config.headers['accept'] = 'application/json';
        config.headers['content-type'] = 'application/json';
        if (token != null) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const jwtTokenFromSecureLS = secureLS.get("FORMIO_TOKEN");
        let formioToken;
        if (!jwtTokenFromSecureLS) {
            formioToken = await getToken(username, password);
            secureLS.set("FORMIO_TOKEN", formioToken);
        } else {
            if (jwt_decode(jwtTokenFromSecureLS).exp < new Date().getTime() / 1000) {
                formioToken = await getToken(username, password);
                secureLS.set("FORMIO_TOKEN", formioToken);
            } else {
                formioToken = jwtTokenFromSecureLS;
            }
        }
        config.headers['x-jwt-token'] = formioToken;
        return Promise.resolve(config)
    }, (err) => {
        return Promise.reject(err);
    });

    const makeRequest = async () => {
        dispatch(executing());
        try {
            const response = await instance[verb](`${baseUrl}${path}`, params);
            dispatch(success(response));
        } catch ({response = null, ...exception}) {
            dispatch(error(response, exception));
        }
    };

    return [state, makeRequest];
};

export default useApiRequest;
