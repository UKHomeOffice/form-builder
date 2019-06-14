import _ from "lodash";
import config from "react-global-configuration";
import {useKeycloak} from "react-keycloak";

const useRoles = () => {
    const [keycloak] = useKeycloak();

    const canPromote = () => {
        const roles = keycloak.tokenParsed.realm_access.roles;
        return _.intersectionWith(config.get('keycloak.promotion-roles'), roles).length >= 1;
    };

    const canEdit = () => {
        const roles = keycloak.tokenParsed.realm_access.roles;
        return _.intersectionWith(config.get('keycloak.edit-roles'), roles).length >= 1;
    };

    return {
        canEdit,
        canPromote
    }
};

export default useRoles;
