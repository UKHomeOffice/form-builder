import VariableReplacer from "./VariableReplacer";
import configuration from '../../config/appConfig.json';

describe("variable replacement", () => {

    const variableReplacer = new VariableReplacer();

    it('can generate uuid for key', async () => {

        const data = {
            "components" :[
                {
                    "key" : "id",
                    "defaultValue" : "{{data.staffDetailsDataContext.staffid}}"
                }
            ]
        };

        const replaced = await variableReplacer.interpolate(data, configuration.environments[0]);
        expect(replaced.components[0].defaultValue).not.toEqual("{{data.staffDetailsDataContext.staffid}}");
    });

});
