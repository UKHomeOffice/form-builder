import dummyjson from 'dummy-json';
import _ from 'lodash';

class VariableReplacer {
    constructor() {
        this.replace = this.replace.bind(this);
    }

    replace(data, replacements = null) {
        let replacedAsJson = dummyjson.parse(JSON.stringify(data));
        if (replacements) {
            const updated = JSON.parse(dummyjson.parse(JSON.stringify(replacements)));
            _.forEach(updated, (replacement) => {
                const key = Object.keys(replacement);
                const value = replacement[key];
                if (!_.startsWith(value, "{{") && !_.endsWith(value, "}}")) {
                    replacedAsJson = _.replace(replacedAsJson,key, value);
                }
            })
        }
        return JSON.parse(replacedAsJson);
    }
}


export default VariableReplacer
