import useEnvContext from "../context/useEnvContext";
import VariableReplacer from "./VariableReplacer";

const useFormDataReplacer = () => {
    const {envContext} = useEnvContext();
    const variableReplacer = new VariableReplacer();
    const performFormParse = async (form) => {
        const variableReplacements = envContext ? envContext['variable-replacements'] : null;
        if (!variableReplacements) {
            return form;
        }
        const updatedForm = variableReplacer.replace(form, variableReplacements);
        return Promise.resolve(updatedForm);
    };

    return {
        performFormParse,
    }
};

export default useFormDataReplacer;
