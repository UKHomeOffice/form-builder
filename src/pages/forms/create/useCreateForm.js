import {useContext, useEffect, useRef, useState} from "react";
import {useNavigation} from "react-navi";
import useApiRequest from "../../../core/api";
import {EXECUTING, SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import {ApplicationContext} from "../../../core/AppRouter";

const useCreateForm = () => {
    const {setState} = useContext(ApplicationContext);
    const navigation = useNavigation();
    const {envContext} = useEnvContext();

    const [form, setValues] = useState({
        json: null,
        title: '',
        path: '',
        display: 'form',
        formName: '',
        displayPreview: false,
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
        `/form`, {
            verb: 'post', params: createPayload()
        }
    );
    const success = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
        setState(state => ({
            ...state, notification: {
                header: `${form.title} created`,
                content: `${form.formName} has been successfully created`
            }
        }));
    };

    const savedCallback = useRef();

    const callback = () => {
        success();
    };

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        if (status === SUCCESS) {
            savedCallback.current();
        }
    }, [status]);

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

    const openPreview = () =>{
        setValues({
            ...form,
            displayPreview: true
        });
    };

    const closePreview = () =>{
        setValues({
            ...form,
            displayPreview: false
        });
    };

    const formInvalid = () => {
        const {path, title, formName, missing} = form;
        return (path === '' || title === '' || formName === '')
            || (missing.path || missing.title || missing.formName) || status === EXECUTING;
    };

    return {
        formInvalid,
        backToForms,
        makeRequest,
        status,
        response,
        setValues,
        form,
        updateField,
        openPreview,
        closePreview
    }
};

export default useCreateForm;
