import {renderHook} from "react-hooks-testing-library";
import useGetForms from "./useGetForms";
import {SUCCESS} from "../../../core/api/actionTypes";

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
    it('gets forms and status SUCCESS', () => {
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(()=>{ return 'fake bar'});

        const apiModule = require('../../../core/api/index');
        apiModule.default = () => {
            return [{
                status: SUCCESS,
                response: {
                    headers: {
                        'content-range': '0-1/1'
                    },
                    data: [{
                        _id: 'formid',
                        name: 'formName',
                        title:'formTitle',
                        path: 'formPath'
                    }]
                }
            }, jest.fn()]
        };


        const {result} = renderHook(() => useGetForms());

        expect(result.current.status).toBe(SUCCESS);
        expect(result.current.forms.data.length).toBe(1);
        expect(result.current.forms.total).toBe(1);

    });


});
