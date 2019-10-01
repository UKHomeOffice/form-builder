import {useKeycloak} from "react-keycloak";
import useEnvContext from "../core/context/useEnvContext";

export const Logout = () => {
    const [keycloak] = useKeycloak();
    const {clearLocalStorage} = useEnvContext();
    clearLocalStorage();
    keycloak.logout({
        redirectUri: window.location.origin.toString()
    });
    return null;
};
