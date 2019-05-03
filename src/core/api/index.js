import {useReducer} from 'react';
import axios from 'axios';
import reducer, {initialState} from './reducer';
import {error, executing, success} from './actionCreators';
import {useKeycloak} from "react-keycloak";

const useApiRequest = (endpoint, {verb = 'get', params = {}} = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [keycloak] = useKeycloak();

    axios.interceptors.request.use((config) => {
        const token = keycloak.token;
        if (token != null) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (err) => {
        return Promise.reject(err);
    });

    const makeRequest = async () => {
        dispatch(executing());
        try {
            const response = await axios[verb](endpoint, params);
            dispatch(success(response));
        } catch ({response = null, ...exception}) {
            dispatch(error(response, exception));
        }
    };

    return [state, makeRequest];
};

export default useApiRequest;
