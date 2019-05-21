import {useKeycloak} from "react-keycloak";
import axios from "axios";
import {useCurrentRoute} from "react-navi";
import useEnvContext from "../context/useEnvContext";

const useLogger = () => {
    const [keycloak] = useKeycloak();
    const route = useCurrentRoute();
    const {envContext} = useEnvContext();
    const createInstance = () => {
        const loggingInstance = axios.create();
        loggingInstance.interceptors.request.use(async (config) => {
            const token = keycloak.token;
            config.headers['accept'] = 'application/json';
            config.headers['content-type'] = 'application/json';
            if (token != null) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return Promise.resolve(config)
        }, (err) => {
            return Promise.reject(err);
        });
        return loggingInstance;
    };

    const loggingInstance = createInstance();

    const log = (loggingStatements) => {
        loggingStatements.forEach((log) => {
            log['user'] = keycloak.tokenParsed.email;
            log['path'] = route.url.pathname;
            log['envContext'] = envContext ? {
                id: envContext.id,
                url: envContext.url,
                label: envContext.label
            }: null;
        });
        loggingInstance.post("/log", loggingStatements);
    };

    return {
        log
    }
};

export default useLogger;
