import {renderHook} from "react-hooks-testing-library";
import {SUCCESS} from "../../../../core/api/actionTypes";
import usePreviewForm from "./usePreviewForm";

describe('Use preview form', () => {
    it('fetches form for preview', () => {
        const naviModule = require('react-navi');
        naviModule.useNavigation = jest.fn(() => {
            return 'fake bar'
        });
        const makeRequest = jest.fn();
        const apiModule = require('../../../../core/api');

        const formData = {
            _id: 'formid',
            name: 'formName',
            title: 'formTitle',
            path: 'formPath'
        };
        apiModule.default = () => {
            return [{
                status: SUCCESS,
                response: {
                    data: formData
                }
            }, makeRequest]
        };
        const {result} = renderHook(() => usePreviewForm("formId"));

        expect(makeRequest).toBeCalled();
        expect(result.current.form.data).toBe(formData);
    });
});
