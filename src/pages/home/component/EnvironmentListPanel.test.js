import EnvironmentListPanel from "./EnvironmentListPanel";
import React from "react";
import {mount} from "enzyme";

describe("Environments panel", () => {

    it('renders enviroments', async () => {

        const data = [
            {
                "id": "dev",
                "url": "http://formio.lodev.xyz",
                "description": "development environment",
                "service": {
                    "username": "me@lodev.xyz",
                    "password": "secret"
                },
                "editable": true,
                "default": true,
                "promotion-preconditions" : []
            },
            {
                "id": "demo",
                "url": "",
                "description": "UAT environment",
                "service" : {
                    "username": "",
                    "password": ""
                },
                "create": false,
                "promotion-preconditions": ["dev"]
            },
            {
                "id": "staging",
                "url": "",
                "description": "Staging environment",
                "service" : {
                    "username": "",
                    "password": ""
                },
                "create": false,
                "promotion-preconditions": ["dev", "demo"]
            },
            {
                "id": "prod",
                "url": "",
                "description": "Prod environment",
                "service" : {
                    "username": "",
                    "password": ""
                },
                "create": false,
                "promotion-preconditions": ["dev", "demo", "staging"]
            }
        ];


        const wrapper = mount(<EnvironmentListPanel environments={data}/>);

        const environmentDivs = wrapper.find(".item");
        expect(environmentDivs).toExist();

        const environments = environmentDivs.find(".item");
        expect(environments.length).toEqual(4);

        const dev = environmentDivs.first();
        console.log(dev);
        expect(dev.find("a").text()).toEqual("dev");

        const prod = environmentDivs.last();
        expect(prod.find("a").text()).toEqual("prod");

    });
});
