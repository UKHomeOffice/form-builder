import useEnvContext from "../context/useEnvContext";
import VariableReplacer from "./VariableReplacer";

const useFormDataReplacer = () => {
    const {envContext} = useEnvContext();
    const variableReplacer = new VariableReplacer();
    const performFormParse = async (form) => {
        return await variableReplacer.interpolate(form, envContext);
    };

    return {
        performFormParse,
    }
};

export default useFormDataReplacer;
