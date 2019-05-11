import {useKeycloak} from "react-keycloak";
import axios from "axios";

const useLogger = () => {
    const [keycloak] = useKeycloak();

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
        loggingInstance.post("/log", loggingStatements);
    };

    return {
        log
    }
};

export default useLogger;
