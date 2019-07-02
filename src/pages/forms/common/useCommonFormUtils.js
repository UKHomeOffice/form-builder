import {useTranslation} from "react-i18next";
import FormioUtils from "formiojs/utils";
import _ from 'lodash';

const useCommonFormUtils = () => {
    const {t} = useTranslation();
    const formChoices = [{
        key: 'form',
        text: t('form.create.form-type.form'),
        value: 'form'
    }, {
        key: 'wizard',
        text: t('form.create.form-type.wizard'),
        value: 'wizard'
    }];

    const handleForm = (form) => {
        if (!form.components) {
            form.components = [];
        }
        const submitButton = FormioUtils.getComponent(form.components, 'submit');
        if (form.display === 'form') {
            if (!submitButton) {
                form.components.push({
                    "autofocus": false,
                    "input": true,
                    "label": "Submit",
                    "tableView": false,
                    "key": "submit",
                    "size": "md",
                    "leftIcon": "",
                    "rightIcon": "",
                    "block": false,
                    "action": "submit",
                    "disableOnInvalid": false,
                    "theme": "primary",
                    "type": "button"
                });
            }
        } else {
            if (submitButton && form.display === 'wizard') {
                _.remove(form.components, (component) => {
                    return component.key === 'submit';
                })
            }
        }

    };

    return {
        formChoices,
        handleForm
    }
};


export default useCommonFormUtils;
