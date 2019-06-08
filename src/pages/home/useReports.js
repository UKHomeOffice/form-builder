import {useContext, useEffect, useRef, useState} from "react";
import {EXECUTING, SUCCESS} from "../../core/api/actionTypes";
import axios from "axios";
import _ from 'lodash';
import config from "react-global-configuration"
import {KeycloakTokenProvider} from "../../core/KeycloakTokenProvider";
import useLogger from "../../core/logging/useLogger";
import {toast} from "react-semantic-toasts";
import {useTranslation} from "react-i18next";
import secureLS from '../../core/storage';
import useEnvContext from "../../core/context/useEnvContext";
import {ApplicationContext} from "../../core/AppRouter";

const useReports = () => {
    const keycloakProvider = new KeycloakTokenProvider();
    const {t} = useTranslation();
    const {log} = useLogger();
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

    const instance = axios.create();

    instance.interceptors.request.use(async (config) => {
            const environment = config.headers['x-environment'];
            const token = secureLS.get("jwt-token");
            const jwtToken = await keycloakProvider.fetchKeycloakToken(environment, token);
            config.headers['Authorization'] = `Bearer ${jwtToken}`;
            delete config.headers['x-environment'];
            return Promise.resolve(config);
        },
        (err) => {
            return Promise.reject(err);
        });

    instance.interceptors.response.use(null, (error) => {
        const url = error.config ? error.config.url : "";
        const errorMessage = error.message;
        toast({
            type: 'error',
            icon: 'exclamation circle',
            title: t('error.general'),
            description: t('home.failure.reports', {url: url, error: errorMessage}),
            animation: 'scale',
            time: 20000
        });
        log([{
            message: `Failed to get report data from ${url}`,
            level: "error",
            exception: errorMessage,
            reportUrl: url
        }]);
        return Promise.resolve({
            headers: {
                'content-range': "0/0"
            }
        })
    });

    const fetchReportsCallback = useRef();


    const callback = async () => {
        clearEnvContext();
        if (state.activeMenuItem) {
            setState(state => ({
                ...state,
                activeMenuItem: null
            }));
        }
        const perEnvResults = await axios.all(environments.map(async (environment) => {
            const url = `${environment.url}/form?select=_id&display__in=form,wizard&limit=1&type__ne=resource`;
            const response = await instance({
                url: url,
                method: 'GET',
                headers: {
                    "x-environment": environment,
                }
            });
            return {
                environment: environment,
                response: response
            }
        }));
        const formsCountData = _.map(perEnvResults, (result) => {
            return {
                "id": result.environment.id,
                "label": result.environment.label,
                "value": parseInt(result.response.headers['content-range'].split('/')[1]),
            }
        });
        setReports(reports => ({
            ...reports,
            statusFormsPerEnvCount: SUCCESS,
            formsPerEnvCount: formsCountData
        }));
        const formTypeResults = await axios.all(environments.map(async (environment) => {

            const formTypes = await instance({
                url: `${environment.url}/form?select=_id&display=form&limit=1&type__ne=resource`,
                method: 'GET',
                headers: {
                    "x-environment": environment,
                }
            });
            const wizardTypes = await instance({
                url: `${environment.url}/form?select=_id&display=wizard&limit=1&type__ne=resource`,
                method: "GET",
                headers: {
                    "x-environment": environment,
                }
            });
            return {
                environment: environment.id,
                formTypes: formTypes,
                wizardTypes: wizardTypes
            }
        }));
        const typeData = _.map(formTypeResults, (result) => {
            const env = result.environment;
            const wizards = parseInt(result.wizardTypes.headers['content-range'].split('/')[1]);
            const forms = parseInt(result.formTypes.headers['content-range'].split('/')[1]);

            return {
                name: env,
                wizard: wizards,
                form: forms,
            }
        });
        setReports(reports => ({
            ...reports,
            statusTypeData: SUCCESS,
            typeData: typeData
        }));

    };

    useEffect(() => {
        fetchReportsCallback.current = callback;
    });
    useEffect(() => {
        const fetch = async () => {
            await fetchReportsCallback.current();
        };
        fetch();
    }, []);
    return {
        reports,

    }
};

export default useReports;
