import {useNavigation} from "react-navi";
import {useContext} from "react";
import {ApplicationContext} from "../Main";

const useEnvContext = () => {
    const navigation = useNavigation();
    const {state, setState} = useContext(ApplicationContext);

    const changeContext = (environment) => {
        setState(state => ({
            ...state, environment: environment
        }));
        navigation.navigate(`/forms/${environment.id}`, {replace: true});
    };

    const clearEnvContext = () => {
        setState(state => ({
            ...state, environment: null
        }));
    };

    const envContext = () => {
        return state.environment
    };

    return {
        changeContext,
        clearEnvContext,
        envContext
    }
};

export default useEnvContext;
