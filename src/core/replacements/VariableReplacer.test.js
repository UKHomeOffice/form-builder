import VariableReplacer from "./VariableReplacer";
import _ from 'lodash';

describe("variable replacement", () => {

    const variableReplacer = new VariableReplacer();

    it('can generate uuid for key', () => {

        const data = {
            "components" :[
                {
                    "key" : "id",
                    "defaultValue" : "{$.staffDetailsContext.staffId}"
                }
            ]
        };

        const replacement = [{
            "{$.staffDetailsContext.staffId}": "{{guid}}"
        }];
        const replaced = variableReplacer.replace(data, replacement);
        expect(replaced.components[0].defaultValue).not.toEqual("{{guid}}");
    });

    it('can generate first name for key', () => {
        const data = {
            "components" :[
                {
                    "key" : "id",
                    "defaultValue" : "{$.staffDetailsContext.staffId}"
                }
            ]
        };
        const replacement = [{
            "{$.keycloakContext.firstName}": "{{firstName}}"
        }];
        const replaced = variableReplacer.replace(data, replacement);
        expect(replaced.components[0].defaultValue).not.toEqual("{{firstName}}");
    });

    it('can replace json', () => {
        const formJSON = {
            "type": "form",
            "components": [

                {
                    "mask": true,
                    "disabled": true,
                    "properties": {},
                    "tags": [],
                    "labelPosition": "top",
                    "type": "textfield",
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    },
                    "validate": {
                        "required": false,
                        "minLength": "",
                        "maxLength": "",
                        "pattern": "",
                        "custom": "",
                        "customPrivate": false
                    },
                    "clearOnHide": true,
                    "hidden": true,
                    "persistent": true,
                    "unique": false,
                    "protected": false,
                    "defaultValue": "{$.keycloakContext.givenName} {$.keycloakContext.familyName}",
                    "multiple": false,
                    "suffix": "",
                    "prefix": "",
                    "placeholder": "",
                    "key": "createdby",
                    "label": "Created by",
                    "inputMask": "",
                    "inputType": "text",
                    "tableView": true,
                    "input": true,
                    "hideLabel": false,
                    "autofocus": false,
                    "spellcheck": true
                },
                {
                    "lockKey": true,
                    "input": true,
                    "tableView": true,
                    "key": "staffid",
                    "label": "staffid",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "type": "hidden",
                    "hideLabel": false,
                    "tags": [],
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    },
                    "properties": {},
                    "defaultValue": "{$.shiftDetailsContext.staffid}"
                },
                {
                    "properties": {},
                    "conditional": {
                        "eq": "",
                        "when": null,
                        "show": ""
                    },
                    "tags": [],
                    "hideLabel": false,
                    "type": "button",
                    "theme": "primary",
                    "disableOnInvalid": true,
                    "action": "submit",
                    "block": false,
                    "rightIcon": "",
                    "leftIcon": "",
                    "size": "md",
                    "key": "submit",
                    "tableView": false,
                    "label": "Add Comment",
                    "input": true,
                    "customConditional": "show = data['message'] !== ''",
                    "autofocus": false,
                    "isNew": false
                },
                {
                    "clearOnRefresh": true,
                    "customConditional": "show = data['targetGroup'] ==='team'",
                    "input": true,
                    "tableView": true,
                    "label": "Team",
                    "key": "teamId",
                    "placeholder": "",
                    "data": {
                        "disableLimit": true,
                        "headers": [
                            {
                                "key": "",
                                "value": ""
                            }
                        ],
                        "custom": "",
                        "resource": "",
                        "url": "{$.environmentContext.platformDataUrl}/api/platform-data/teamlocations?select=teamid,locationid,team(teamname)",
                        "json": "",
                        "values": [
                            {
                                "label": "",
                                "value": ""
                            }
                        ]
                    },
                    "dataSrc": "url",
                    "valueProperty": "teamid",
                    "defaultValue": "",
                    "refreshOn": "locationid",
                    "filter": "locationid=eq.{{data.locationid}}",
                    "authenticate": false,
                    "template": "\u003cspan\u003e{{ item.team.teamname }}\u003c/span\u003e",
                    "multiple": false,
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "hidden": false,
                    "clearOnHide": true,
                    "validate": {
                        "custom": "",
                        "required": false
                    },
                    "type": "select",
                    "hideLabel": false,
                    "labelPosition": "top",
                    "tags": [],
                    "conditional": {
                        "eq": "",
                        "when": null,
                        "show": ""
                    },
                    "properties": {},
                    "lockKey": true,
                    "autofocus": false,
                    "searchField": "teamname"
                }
            ],
            "display": "form",
            "title": "Create A Comment",
            "name": "createAComment",
            "path": "createacomment",
        };

        const replacements = [{
            "{$.shiftDetailsContext.staffid}": "{{guid}}"
        }, {
            "{$.keycloakContext.givenName}": "{{firstName}}",
        }, {
            "{$.keycloakContext.familyName}": "{{lastName}}"
        }, {
            "{$.environmentContext.platformDataUrl}": "www.google.co.uk"
        }];

        const replaced = variableReplacer.replace(formJSON, replacements);

        const teamSelectComponent = _.find(replaced.components, {key: 'teamId'});
        expect(teamSelectComponent.data.url).toEqual('www.google.co.uk/api/platform-data/teamlocations?select=teamid,locationid,team(teamname)');
        expect(teamSelectComponent.template).toEqual("<span>{{ item.team.teamname }}</span>");
    });
});
