import {useContext} from "react";
import {ApplicationContext} from "../Main";
import environments from '../../environments';
import _ from 'lodash';
import secureLS from '../storage';

const useEnvContext = () => {
    const {state, setState} = useContext(ApplicationContext);
    const changeContext = (environment) => {
        secureLS.remove("FORMIO_TOKEN");
        secureLS.set("ENVIRONMENT", environment.id);
        setState(state => ({
            ...state, environment: environment
        }));
    };

    const clearEnvContext = () => {
        setState(state => ({
            ...state, environment: null
        }));
        secureLS.remove("FORMIO_TOKEN");
        secureLS.remove("ENVIRONMENT");
    };

    const defaultEnv = _.find(environments, {default: true});

    const envContext = state.environment ? state.environment : _.find(environments, {id: secureLS.get("ENVIRONMENT")});


    return {
        changeContext,
        clearEnvContext,
        envContext,
        defaultEnv,
    }
};

export default useEnvContext;
