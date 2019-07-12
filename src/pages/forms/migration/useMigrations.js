import useEnvContext from "../../../core/context/useEnvContext";
import {useEffect} from "react";

const useMigrations = () => {
    const {clearEnvContext} = useEnvContext();

    useEffect(() => {
        clearEnvContext();
    }, []);

    return {

    }
};

export default useMigrations;
