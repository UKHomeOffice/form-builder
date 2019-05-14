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

    return {
        formChoices
    }
};


export default useCommonFormUtils;
