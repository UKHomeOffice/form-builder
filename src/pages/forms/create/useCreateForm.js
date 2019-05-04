import {useContext, useState} from "react";
import {ApplicationContext} from "../../../core/Main";
import {useNavigation} from "react-navi";
import useApiRequest from "../../../core/api";
import {EXECUTING} from "../../../core/api/actionTypes";

import _ from 'lodash';

const useCreateForm = () => {
    const {setState} = useContext(ApplicationContext);
    const navigation = useNavigation();
    const [form, setValues] = useState({
        json: null,
        title: '',
        path: '',
        display: 'form',
        formName: '',
        missing: {
            path: false,
            title: false,
            formName: false
        }
    });

    const createPayload = () => {
        if (form.json) {
            form.json['title'] = form.title;
            form.json['path'] = form.path;
            form.json['name'] = form.formName;
            return form.json;
        }
        return null;
    };

    const [{status, response}, makeRequest] = useApiRequest(
        `${process.env.REACT_APP_FORMIO_URL}/form`, {
            verb: 'post', params: createPayload()
        }
    );

    const success = () => {
        navigation.navigate("/forms", {replace: true});
        setState(state => ({
            ...state, notification: {
                header: `${form.title} created`,
                content: `${form.formName} has been successfully created`
            }
        }));
    };

    const backToForms = () => {
        navigation.navigate("/forms");
    };

    const updateField = (target, value) => {
        const hasValue = value && value !== '';
        if (target === 'title') {
            if (hasValue) {
                form.missing['title'] = false;
                form.missing["path"] = false;
                form.missing["formName"] = false;
                setValues({
                    ...form,
                    "title" : value,
                    "path": _.toLower(value).replace(/\s/g, ''),
                    "formName":  _.camelCase(value)
                });
            } else {
                form.missing['title'] = true;
                setValues({
                    ...form,
                    "title" : '',
                });
            }

        } else {
            form.missing[target] = !hasValue;
            setValues({
                ...form,
                [target]: value
            });
        }

    };

    const formInvalid = () => {
        const {path, title, formName, missing} = form;
        return (path === '' || title === '' || formName === '')
            || (missing.path || missing.title || missing.formName) || status === EXECUTING;
    };

    return {
        formInvalid,
        success,
        backToForms,
        makeRequest,
        status,
        response,
        setValues,
        form,
        updateField
    }
};

export default useCreateForm;
