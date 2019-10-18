import Base from 'formiojs/components/_classes/component/Component';
import FormComponent from 'formiojs/components/form/Form';
import Components from 'formiojs/components/Components';

export class SubFormComponent extends FormComponent {

    static schema(...extend) {
        return Base.schema({
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
