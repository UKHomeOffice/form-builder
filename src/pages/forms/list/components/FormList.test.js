import React from 'react';
import * as _ from "lodash";
import {mount} from "enzyme";
import FormList from "./FormList";

jest.mock('../../../../core/api/index');
jest.mock('../../common/DeleteFormButton', () => {
    const DeleteButton = () => (
        <div>Delete button</div>
    );
    return DeleteButton;
});

describe('FormList', () => {
    it('renders a semantic ui table of forms', async () => {
        const forms = _.range(0, 10).map((index) => {
            return {
                '_id': `form${index}`,
                'title': `formTitle${index}`,
                'name': `formName${index}`,
                'display': `form`,
                'path': `/formPath${index}`
            };
        });

        const wrapper = await mount(<FormList forms={forms}/>);
        const table = wrapper.find('table');
        expect(table).toHaveLength(1)

        const thead = table.find('thead');
        expect(thead).toHaveLength(1);

        const tbody = table.find('tbody');
        expect(tbody).toHaveLength(1);

        const rows = tbody.find('tr');
        expect(rows).toHaveLength(forms.length);

        rows.forEach((tr, rowIndex) => {
            const cells = tr.find('td');
            expect(cells.at(0).text()).toEqual(forms[rowIndex]._id);
            expect(cells.at(1).text()).toEqual(forms[rowIndex].title);
            expect(cells.at(2).text()).toEqual(forms[rowIndex].name);
            expect(cells.at(3).text()).toEqual(forms[rowIndex].path);

        });
    });
});
