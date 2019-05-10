import useEnvContext from "../context/useEnvContext";
import VariableReplacer from "./VariableReplacer";

const useFormDataReplacer = () => {
    const {envContext} = useEnvContext();
    const variableReplacer = new VariableReplacer();
    const parseForm = (form) => {
        const variableReplacements = envContext ? envContext['variable-replacements'] : null;
        if (!variableReplacements) {
            return form;
        }
        return variableReplacer.replace(form, variableReplacements);
    };

    return {
        parseForm
    }
};

export default useFormDataReplacer;
