import {renderHook} from "react-hooks-testing-library";
import useGetForms from "./useGetForms";
import {EXECUTING} from "../../../core/api/actionTypes";

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
    it('gets forms and status EXECUTING', () => {
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(()=>{ return 'fake bar'});

        const apiModule = require('../../../core/api/index');
        apiModule.default = () => {
            return [{
                status: EXECUTING
            }, jest.fn()]
        };

        const {result} = renderHook(() => useGetForms());

        expect(result.current.status).toBe(EXECUTING);
    });
});
