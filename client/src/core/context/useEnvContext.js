import {useContext} from "react";
import secureLS from '../storage';
import {ApplicationContext} from "../AppRouter";
import config from "react-global-configuration"
import _ from 'lodash';


const useEnvContext = () => {
    const {state, setState} = useContext(ApplicationContext);
    const environments = config.get('environments');

    const clearLocalStorage = () => {
        secureLS.removeAll();
    };

    const changeContext = (environment) => {
        const envId = environment.id;
        if (envId) {
            secureLS.set("ENVIRONMENT", envId);
        }
        setState(state => ({
            ...state, environment: environment
        }));
    };

    const changeContextById = (id) => {
        const env = getEnvDetails(id);
        changeContext(env);
    };

    const clearEnvContext = () => {
        secureLS.remove("ENVIRONMENT");
        setState(state => ({
            ...state, environment: null
        }));
    };

    const getEnvDetails = (id) => {
        return _.find(environments, {id: id});
    };

    const availableEnvironments = (env) => {
        return _.filter(environments, (environment) => environment.id !== env);
    };

    const envContext = state.environment ? state.environment : getEnvDetails(secureLS.get("ENVIRONMENT"));

    const editableEnvironments = () => {
        const environments = config.get('environments');
        return _.filter(environments, (environment) => {
            return environment.editable;
        });
    };

    return {
        editableEnvironments,
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
