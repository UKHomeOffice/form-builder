import {useContext, useEffect, useRef, useState} from "react";
import {EXECUTING, SUCCESS} from "../../core/api/actionTypes";
import axios from "axios";
import _ from 'lodash';
import config from "react-global-configuration"
import {KeycloakTokenProvider} from "../../core/KeycloakTokenProvider";
import {useTranslation} from "react-i18next";
import useEnvContext from "../../core/context/useEnvContext";
import {ApplicationContext} from "../../core/AppRouter";
import {useKeycloak} from "react-keycloak";
import eventEmitter from "../../core/eventEmitter";

const useReports = () => {
    const keycloakProvider = new KeycloakTokenProvider();
    const {t} = useTranslation();
    const [keycloak] = useKeycloak();

    const [reports, setReports] = useState({
        statusFormsPerEnvCount: EXECUTING,
        activeIndex: 0,
        formsPerEnvCount: [],
        typeData: [],
        statusTypeData: EXECUTING
    });
    const {clearEnvContext} = useEnvContext();
    const {state, setState} = useContext(ApplicationContext);
    const environments = config.get('environments');

    const isMounted = useRef(true);

    const instance = axios.create();

    instance.interceptors.request.use(async (config) => {
            const environment = config.headers['x-environment'];
            const jwtToken = await keycloakProvider.fetchKeycloakToken(environment, keycloak);
            config.headers['Authorization'] = `Bearer ${jwtToken}`;
            return Promise.resolve(config);
        },
        (err) => {
            return Promise.reject(err);
        });

    const fetchReportsCallback = useRef();
    const cancelTokenRefs = useRef([]);
    const CancelToken = axios.CancelToken;

    const callback = async () => {
        clearEnvContext();
        if (state.activeMenuItem) {
            setState(state => ({
                ...state,
                activeMenuItem: null
            }));
        }
        const perEnvResults = await axios.all(environments.map(async (environment) => {
            const source = CancelToken.source();
            cancelTokenRefs.current.push(source);
            const url = `${environment.url}/form?countOnly=true`;

            try {
                const response = await instance({
                    url: url,
                    method: 'GET',
                    headers: {
                        "x-environment": environment,
                    },
                    cancelToken: source.token
                });
                return Promise.resolve({
                    environment: environment,
                    response: response.data
                });
            } catch (error) {
                if (!axios.isCancel(error)) {

                    eventEmitter.publish('error', {
                        id: environment.id,
                        message: `${t('error.general')}: ${t('home.failure.reports', {
                            url: url,
                            error: error.message
                        })}`
                    });
                }
                return Promise.resolve({
                    environment: environment,
                    response: {
                        total: 0
                    }
                });
            }
        }));
        const formsCountData = _.map(perEnvResults, (result) => {
            return {
                "id": result.environment.id,
                "label": result.environment.label,
                "value": result.response ? parseInt(result.response.total) : 0
            }
        });

        if (isMounted.current) {
            setReports(reports => ({
                ...reports,
                statusFormsPerEnvCount: SUCCESS,
                formsPerEnvCount: formsCountData
            }));
        }

        const formTypeResults = await axios.all(environments.map(async (environment) => {
            const source = CancelToken.source();
            cancelTokenRefs.current.push(source);
            try {
                const formTypes = await instance({
                    url: `${environment.url}/form?filter=display__eq__form&countOnly=true`,
                    method: 'GET',
                    headers: {
                        "x-environment": environment,
                    },
                    cancelToken: source.token
                });
                const wizardTypes = await instance({
                    url: `${environment.url}/form?filter=display__eq__wizard&countOnly=true`,
                    method: "GET",
                    headers: {
                        "x-environment": environment,
                    },
                    cancelToken: source.token
                });
                return {
                    environment: environment.id,
                    formTypes: formTypes.data,
                    wizardTypes: wizardTypes.data
                }
            } catch (error) {
                if (error.message && error.message !== 'Cancelling API request') {
                    eventEmitter.publish('error', {
                        id: environment.id,
                        message: `${t('error.general')}: ${t('home.failure.reports', {
                            url: environment.url,
                            error: error.message
                        })}`
                    });

                }
                return {
                    environment: environment.id,
                    formTypes: {
                        total: 0
                    },
                    wizardTypes: {
                        total: 0
                    }
                }
            }
        }));
        const typeData = _.map(formTypeResults, (result) => {
            const env = result.environment;
            const wizards = parseInt(result.wizardTypes.total);
            const forms = parseInt(result.formTypes.total);

            return {
                name: env,
                wizard: wizards,
                form: forms,
            }
        });
        if (isMounted.current) {
            setReports(reports => ({
                ...reports,
                statusTypeData: SUCCESS,
                typeData: typeData
            }));
        }

    };

    useEffect(() => {
        fetchReportsCallback.current = callback;
    });
    useEffect(() => {
        const fetch = async () => {
            await fetchReportsCallback.current();
        };
        fetch();
        const tokens = cancelTokenRefs.current;
        return () => {
            isMounted.current = false;
            tokens.forEach((source) => {
                source.cancel("Cancelling API request");
            })
        }
    }, []);
    return {
        reports,

    }
};

export default useReports;
