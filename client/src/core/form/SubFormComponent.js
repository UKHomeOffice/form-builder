
const Component = require('formiojs/components/_classes/component/Component').default;
const Components = require('formiojs/components/Components').default;
const FormComponent = require('formiojs/components/form/Form').default;


export class SubFormComponent extends FormComponent {

    static schema(...extend) {
        return Component.schema({
            label: 'Form',
            type: 'form',
            key: 'form',
            src: '',
            reference: false,
            form: '',
            path: '',
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Nested Form',
            icon: 'wpforms',
            group: 'premium',
            documentation: 'http://help.form.io/userguide/#form',
            weight: 110,
            schema: SubFormComponent.schema()
        };
    }
}

Components.addComponent('form', SubFormComponent);
