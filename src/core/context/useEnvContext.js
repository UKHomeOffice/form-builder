import {useContext} from "react";
import secureLS from '../storage';
import {ApplicationContext} from "../AppRouter";
import config from "react-global-configuration"
import _ from 'lodash';



const useEnvContext = () => {
    const {state, setState} = useContext(ApplicationContext);
    const environments = config.get('environments');

    const clearLocalStorage = () => {
        secureLS.remove("FORMIO_TOKEN");
        secureLS.remove("ENVIRONMENT");
    };

    const changeContext = (environment) => {
        clearLocalStorage();
        secureLS.set("ENVIRONMENT", environment.id);
        setState(state => ({
            ...state, environment: environment
        }));
    };

    const changeContextById = (id) => {
        const env = getEnvDetails(id);
        changeContext(env);
    };

    const clearEnvContext = () => {
        setState(state => ({
            ...state, environment: null
        }));
        clearLocalStorage();
    };

    const getEnvDetails = (id) => {
        return _.find(environments, {id: id});
    };

    const availableEnvironments = (env) => {
        return _.filter(environments, (environment) => environment.id !== env);
    };

    const envContext = state.environment ? state.environment : getEnvDetails(secureLS.get("ENVIRONMENT"));

    return {
        changeContext,
        clearEnvContext,
        envContext,
        clearLocalStorage,
        changeContextById,
        availableEnvironments,
        getEnvDetails
    }
};

export default useEnvContext;
