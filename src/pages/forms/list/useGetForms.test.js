import {renderHook, act} from "react-hooks-testing-library";
import useGetForms from "./useGetForms";
import {EXECUTING, SUCCESS} from "../../../core/api/actionTypes";

describe('useGetForms', () => {
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

    it ('can handle pagination', () => {
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(()=>{ return 'fake bar'});
        const makeRequest = jest.fn();
        const apiModule = require('../../../core/api/index');
        apiModule.default = () => {
            return [{}, makeRequest]
        };
        const {result} = renderHook(() => useGetForms());

        act(() => result.current.handlePaginationChange(null, {activePage: 2}))

        expect(makeRequest).toBeCalled();
        expect(result.current.forms.activePage).toBe(2);
    });

    it('can handle title search', () => {
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(()=>{ return 'fake bar'});
        const makeRequest = jest.fn();
        const apiModule = require('../../../core/api/index');
        apiModule.default = () => {
            return [{}, makeRequest]
        };
        const {result} = renderHook(() => useGetForms());

        act(() => result.current.handleTitleSearch(null, {value: 'text'}));

        expect(makeRequest).toBeCalled();
        expect(result.current.forms.searchTitle).toBe('text')
    })
});
