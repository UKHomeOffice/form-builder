import {act, renderHook} from 'react-hooks-testing-library'
import useCreateForm from "./useCreateForm";
import {useProxyApiRequest} from "../../../core/api";

jest.mock('react-toast-notifications', () => ({
    withToastManager: () => {
        return jest.fn();
    },
    useToasts: () => {
        return {
            addToast: () => {
                return jest.fn();
            }
        }
    }
}));

describe('useCreateForm', () => {
    beforeEach(() => {

        const contextModule = require('../../../core/context/useEnvContext');
        contextModule.default = () => {
            return {
                envContext: {}
            }
        };


        const addToastModule = require('react-toast-notifications');
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(() => {
            return {
                getCurrentValue: () => {
                    return {
                        url: {
                            pathname: 'test'
                        }
                    }
                }
            }
        });

        const loggingModule = require('../../../core/logging/useLogger');
        loggingModule.default = () => {
            return {
                log: jest.fn()
            }
        };

        const apiModule = require('../../../core/api');
        apiModule.useProxyApiRequest = () => {
            return [{}, jest.fn()]
        };

    });
    it('check if form is invalid', () => {
        const {result} = renderHook(() => useCreateForm());
        expect(result.current.formInvalid()).toBe(true);
    });

    it('check form is valid', () => {
        const {result} = renderHook(() => useCreateForm());
        act(() => result.current.setValues({
            ...result.current.form,
            data: {
                'path': 'path',
                'title': 'title',
                'name': 'formName',
            },
            'missing': {
                'path': false,
                'title': false,
                'name': false
            }
        }));
        expect(result.current.formInvalid()).toBe(false);
    });

    it('updates path and formName if title is set', () => {
        const {result} = renderHook(() => useCreateForm());
        act(() => result.current.updateField("title", "test Title"));
        expect(result.current.form.data.name).toBe("testTitle");
        expect(result.current.form.data.path).toBe("testtitle");
    });
    it('leaves path and form name if title removed', () => {
        const {result} = renderHook(() => useCreateForm());

        act(() => result.current.updateField("title", "test Title"));
        act(() => result.current.updateField("title", ""));

        expect(result.current.form.data.name).toBe("testTitle");
        expect(result.current.form.data.path).toBe("testtitle");
    });
});
