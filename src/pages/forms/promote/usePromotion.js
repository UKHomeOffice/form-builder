import useApiRequest, {useMultipleApiCallbackRequest} from "../../../core/api";
import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import {SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";

const usePromotion = (formId) => {

    const navigation = useNavigation();
    const [form, setValue] = useState({
        data: null,
        formId: formId,
        step: 'form',
        disabled: true,
        environment: null
    });
    const {envContext, g} = useEnvContext();

    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${formId}`, {
            verb: 'get', params: {}
        }
    );


    const [promotionState, promote] = useMultipleApiCallbackRequest((axios) => {

    }, [{
        message: `Initiating form ${form.data ? form.data.name : ''} promotion to ${form.environment}`,
        level: 'info'
    }], [
        { message: `${form.data ? form.data.name : ''} successfully promoted to ${form.environment}`,
            level: 'info'}
    ]);

    const savedCallback = useRef();

    const callback = () => {
        setValue(form => ({
            ...form,
            data: null
        }));
        makeRequest();
    };

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        savedCallback.current();
    }, [form.formId]);


    useEffect(() => {
        if (status === SUCCESS) {
            setValue(form => ({
                ...form,
                data: response.data
            }));
        }
    }, [response, status, setValue]);

    const backToForms = () => {
        navigation.navigate(`/forms/${envContext.id}`, {replace: true});
    };

    const isDisabled = () => {
        return !form.environment
    };


    return {
        status,
        form,
        response,
        setValue,
        isDisabled,
        backToForms,
        promotionState,
        promote
    }
};

export default usePromotion;
