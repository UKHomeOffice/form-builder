import {act, renderHook} from 'react-hooks-testing-library'
import useCreateForm from "./useCreateForm";


describe('useCreateForm', () => {
    beforeEach(() => {
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(()=>{ return 'fake bar'});

        const apiModule = require('../../../core/api/index');
        apiModule.default = () => {
            return [{}, jest.fn()]
        };


        const contextModule = require('../../../core/context/useEnvContext');
        contextModule.default = () => {
            return {
                envContext: {}
            }
        }
    });
    it('check if form is invalid', () => {
        const {result} = renderHook(() => useCreateForm());
        expect(result.current.formInvalid()).toBe(true);
    });

    it('check form is valid', () => {
        const {result} = renderHook(() => useCreateForm());
        act(() => result.current.setValues({
            ...result.current.form,
            'path': 'path',
            'title': 'title',
            'formName': 'formName',
            'missing': {
                'path': false,
                'title': false,
                'formName': false
            }
        }));
        expect(result.current.formInvalid()).toBe(false);
    });

    it('updates path and formName if title is set', () => {
        const {result} = renderHook(() => useCreateForm());
        act(() => result.current.updateField("title", "test Title"));
        expect(result.current.form.formName).toBe("testTitle");
        expect(result.current.form.path).toBe("testtitle");
    });
    it('leaves path and form name if title removed', () => {
        const {result} = renderHook(() => useCreateForm());

        act(() => result.current.updateField("title", "test Title"));
        act(() => result.current.updateField("title", ""));

        expect(result.current.form.formName).toBe("testTitle");
        expect(result.current.form.path).toBe("testtitle");
    });
});
