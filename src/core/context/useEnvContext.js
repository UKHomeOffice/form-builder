import {useContext} from "react";
import {ApplicationContext} from "../Main";
import environments from '../../environments';
import _ from 'lodash';
import secureLS from '../storage';

const useEnvContext = () => {
    const {state, setState} = useContext(ApplicationContext);
    const changeContext = (environment) => {
        secureLS.remove("FORMIO_TOKEN");
        setState(state => ({
            ...state, environment: environment
        }));
    };

    const clearEnvContext = () => {
        setState(state => ({
            ...state, environment: null
        }));
        secureLS.remove("FORMIO_TOKEN");
    };

    const defaultEnv = _.find(environments, {default: true});

    const envContext = state.environment;


    return {
        changeContext,
        clearEnvContext,
        envContext,
        defaultEnv,
    }
};

export default useEnvContext;
