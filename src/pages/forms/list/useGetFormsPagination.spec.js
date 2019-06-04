import {act, renderHook} from "react-hooks-testing-library";
import useGetForms from "./useGetForms";

jest.useFakeTimers();
describe('useGetForms', () => {
    beforeEach(() => {
        window.URL.createObjectURL = jest.fn();
        window.URL.revokeObjectURL = jest.fn();
        const contextModule = require('../../../core/context/useEnvContext');
        contextModule.default = () => {
            return {
                envContext: {}
            }
        }
    });

    it('can handle pagination', () => {
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(() => {
            return 'fake bar'
        });
        const makeRequest = jest.fn();
        const apiModule = require('../../../core/api/index');
        apiModule.default = () => {
            return [{}, makeRequest]
        };
        const {result} = renderHook(() => useGetForms());

        act(() => result.current.handlePaginationChange(null, {activePage: 2}));

        expect(makeRequest).toBeCalled();
        expect(result.current.forms.activePage).toBe(2);
    });


});
