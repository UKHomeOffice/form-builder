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

    const clearEnvContext = () => {
        setState(state => ({
            ...state, environment: null
        }));
        clearLocalStorage();
    };

    const envContext = state.environment ? state.environment : _.find(environments, {id: secureLS.get("ENVIRONMENT")});

    return {
        changeContext,
        clearEnvContext,
        envContext,
        clearLocalStorage
    }
};

export default useEnvContext;
