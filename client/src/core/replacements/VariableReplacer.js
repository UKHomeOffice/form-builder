import FormioUtils from 'formiojs/utils';
import jsf from 'json-schema-faker';
import Chance from 'chance';
import faker from 'faker';
import moment from 'moment'; 
import _ from 'lodash';

class VariableReplacer {
    constructor() {
        jsf.option({ alwaysFakeOptionals: true });
        jsf.extend('chance', () => new Chance());
        jsf.extend('faker', () => faker);

    }

    interpolate(form, environmentContext) {
        try {
            const fakeSubmission = jsf.generate(JSON.parse(JSON.stringify(environmentContext['fakeDataInterpolationContext'])));

            FormioUtils.eachComponent(form.components, component => {
                component.label = FormioUtils.interpolate(component.label, {
                    data: fakeSubmission.data
                });
                if (component.type === 'select' && component.data.url !== '') {
                    component.data.url = FormioUtils.interpolate(component.data.url, {
                        data: fakeSubmission.data
                    });
                }
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
                if (component.defaultValue && component.defaultValue !== '') {
                    component.defaultValue = FormioUtils.interpolate(component.defaultValue, {
                        data: fakeSubmission.data
                    });
                }
                if (component.customDefaultValue && component.customDefaultValue !== '') {
                    component.defaultValue = FormioUtils.evaluate(component.customDefaultValue, {
                        data: fakeSubmission.data,
                        moment: moment,
                        _ : _,
                        component: component,
                        form : form,
                        utils: FormioUtils,
                        util: FormioUtils
                    }, "value");
                    component.customDefaultValue = "";

                }

            });
        } catch (e) {
            console.warn(e);
            return form;
        }
        return form;
    }
}


export default VariableReplacer
