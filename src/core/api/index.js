import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import {useKeycloak} from "react-keycloak";

const useApiRequest = (endpoint, {verb = 'get', params = {}} = {}, env = 'dev') => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [keycloak] = useKeycloak();
    const instance = axios.create();

    const getToken = async (username, password) => {
        const tokenResponse = await axios.post(`${process.env.REACT_APP_FORMIO_URL}/user/login`, {
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
        config.headers['x-jwt-token'] = await getToken(process.env.REACT_APP_FORMIO_USER, process.env.REACT_APP_FORMIO_PASSWORD);
        return Promise.resolve(config)
    }, (err) => {
        return Promise.reject(err);
    });

    const makeRequest = async () => {
        dispatch(executing());
        try {
            const response = await instance[verb](endpoint, params);
            dispatch(success(response));
        } catch ({response = null, ...exception}) {
            dispatch(error(response, exception));
        }
    };

    return [state, makeRequest];
};

export default useApiRequest;
