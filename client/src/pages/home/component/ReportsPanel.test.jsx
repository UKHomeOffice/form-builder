import {SUCCESS} from "../../../core/api/actionTypes";
import ReportsPanel from "./ReportsPanel";
import React from "react";
import {mount} from "enzyme";

describe("ReportsPanel", () => {
    beforeEach(() => {
        const useReports = require('../useReports');
        useReports.default = () => {

            const reports = {
                statusFormsPerEnvCount: SUCCESS,
                activeIndex: 0,
                formsPerEnvCount: [{
                    "id": "dev",
                    "label": "Development",
                    "value": 10
                }, {
                    "id": "demo",
                    "label": "Demo",
                    "value": 12
                }],
                typeData: [{
                    "name": "dev",
                    "wizard": 10,
                    "form": 12
                }, {
                    "name": "demo",
                    "wizard": 10,
                    "form": 12
                }],
                statusTypeData: SUCCESS
            };
            return {
                reports: reports
            }
        }
    });

    it('renders pie and bar chart', async () => {
        const wrapper = mount(<ReportsPanel/>);
        expect(wrapper).toMatchSnapshot();
    });
});
