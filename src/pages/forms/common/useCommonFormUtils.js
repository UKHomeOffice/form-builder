import {useTranslation} from "react-i18next";

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

    const submissionAccess = (id) => {
        return [
            {
                "roles": [
                    id
                ],
                "type": "create_all"
            },
            {
                "roles": [
                    id
                ],
                "type": "read_all"
            },
            {
                "roles": [
                    id
                ],
                "type": "update_all"
            },
            {
                "roles": [
                    id
                ],
                "type": "delete_all"
            },
            {
                "roles": [
                    id
                ],
                "type": "create_own"
            },
            {
                "roles": [
                    id
                ],
                "type": "read_own"
            },
            {
                "roles": [
                    id
                ],
                "type": "update_own"
            },
            {
                "roles": [
                    id
                ],
                "type": "delete_own"
            }
        ];
    };
    return {
        formChoices,
        submissionAccess
    }
};


export default useCommonFormUtils;
