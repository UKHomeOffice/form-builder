import dummyjson from 'dummy-json';
import _ from 'lodash';

class VariableReplacer {
    constructor() {
        this.replace = this.replace.bind(this);
    }

    replace(data, replacements) {
        let asString = JSON.stringify(data);
        if (replacements) {
            const updated = JSON.parse(dummyjson.parse(JSON.stringify(replacements)));
            _.forEach(updated, (replacement) => {
                const key = Object.keys(replacement)[0];
                const value = replacement[key];
                if (!_.startsWith(value, "{{") && !_.endsWith(value, "}}")) {
                    while (asString.includes(key)) {
                        asString = asString.replace(key, value);
                    }
                }
            });
        }
        return JSON.parse(asString);
    }
}


export default VariableReplacer
