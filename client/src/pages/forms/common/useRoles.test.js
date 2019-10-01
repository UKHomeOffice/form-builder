import {renderHook} from "react-hooks-testing-library";
import useRoles from "./useRoles";
import config from "react-global-configuration";
jest.mock("react-keycloak", () => ({
    useKeycloak: () => {
        return [
            {
                tokenParsed: {
                    realm_access: {
                        roles: [
                            'testRole'
                        ]
                    }
                }
            }
        ];
    }
}));
config.set({
    keycloak: {
        'promotion-roles' : [
            'testRole'
        ],
        'edit-roles' : [
            'testRole'
        ]
    }
});
describe('useRoles', () => {
    it('checks if can promote', () => {
        const {result} = renderHook(() => useRoles());
        expect(result.current.canPromote()).toBe(true);

    });

    it('checks if can edit', () => {
        const {result} = renderHook(() => useRoles());
        expect(result.current.canEdit()).toBe(true);
    });
});
