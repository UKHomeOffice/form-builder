import FormioUtils from 'formiojs/utils';
import jsf from 'json-schema-faker';
import Chance from 'chance';
import faker from 'faker';

class VariableReplacer {
    constructor() {
        jsf.option({ alwaysFakeOptionals: true });
        jsf.extend('chance', () => new Chance());
        jsf.extend('faker', () => faker);

    }

    async interpolate(form, environmentContext) {
        const fakeSubmission = jsf.generate(JSON.parse(JSON.stringify(environmentContext['fakeDataInterpolationContext'])));

        FormioUtils.eachComponent(form.components, component => {
            component.label = FormioUtils.interpolate(component.label, {
                data: fakeSubmission.data
            });
            if (component.type === 'content') {
                component.html = FormioUtils.interpolate(component.html, {
                    data: fakeSubmission.data
                });
            }
            if (component.type === 'htmlelement') {
                component.content = FormioUtils.interpolate(component.content, {
                    data: fakeSubmission.data
                });
            }
            if (component.defaultValue) {
                component.defaultValue = FormioUtils.interpolate(component.defaultValue, {
                    data: fakeSubmission.data
                });
            }
            if (component.customDefaultValue && component.customDefaultValue !== '') {
                component.defaultValue = FormioUtils.evaluate(component.customDefaultValue, {
                    data: fakeSubmission.data
                }, "value");
                component.customDefaultValue = "";

            }
            if (component.calculateValue && component.calculateValue !== '') {
                component.defaultValue = FormioUtils.evaluate(component.calculateValue, {
                    data: fakeSubmission.data
                }, "value");
                component.calculateValue = "";
            }
        });
        return Promise.resolve(form);
    }
}


export default VariableReplacer
