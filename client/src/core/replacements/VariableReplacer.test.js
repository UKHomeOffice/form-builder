import VariableReplacer from "./VariableReplacer";
import configuration from '../../config/appConfig.json';

describe("variable replacement", () => {

    const variableReplacer = new VariableReplacer();

    it('can generate uuid for key', () => {

        const data = {
            "components" :[
                {
                    "key" : "id",
                    "defaultValue" : "{{data.staffDetailsDataContext.staffid}}"
                }
            ]
        };

        const replaced =  variableReplacer.interpolate(data, configuration.environments[0]);
        expect(replaced.components[0].defaultValue).not.toEqual("{{data.staffDetailsDataContext.staffid}}");
    });

});
