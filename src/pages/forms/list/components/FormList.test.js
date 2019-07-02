import React from 'react';
import {mount} from "enzyme";
import FormList from "./FormList";

import useGetForms from '../useGetForms';


jest.mock('../useGetForms', () => () => {
    const _ = require('lodash');
    const formsData = _.range(0, 10).map((index) => {
        return {
            '_id': `form${index}`,
            'title': `formTitle${index}`,
            'name': `formName${index}`,
            'display': `form`,
            'path': `/formPath${index}`
        };
    });

    return ({
        handleSort: jest.fn,
        forms: {
            direction: null,
            data: formsData
        }
    })
});

jest.mock('../../common/components/DeleteFormButton', () => {
    const DeleteButton = () => (
        <div>Delete button</div>
    );
    return DeleteButton;
});

describe('FormList', () => {
    beforeEach(() => {
        const contextModule = require('../../../../core/context/useEnvContext');
        contextModule.default = () => {
            return {
                envContext: {}
            }
        };
        const useRoles = require('../../../forms/common/useRoles');
        useRoles.default = () => {
            return {
                canEdit: () => {},
                canPromote: () => {}
            }
        };

    });
    it('renders a semantic ui table of forms', async () => {

        const {forms} = useGetForms();
        const data = forms.data;

        const wrapper = await mount(<FormList/>);
        const table = wrapper.find('table');
        expect(table).toHaveLength(1);

        const thead = table.find('thead');
        expect(thead).toHaveLength(1);

        const tbody = table.find('tbody');
        expect(tbody).toHaveLength(1);

        const rows = tbody.find('tr');
        expect(rows).toHaveLength(data.length);

        rows.forEach((tr, rowIndex) => {
            const cells = tr.find('td');
            expect(cells.at(0).text()).toEqual(`formTitle${rowIndex}formTitle${rowIndex}Identifier:Name:formName${rowIndex}Path:/formPath${rowIndex}Created:a few seconds agoUpdated:a few seconds ago`);
            expect(cells.at(1).text()).toEqual(data[rowIndex].name);

        });
    });
});
