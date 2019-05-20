import {useEffect, useState} from "react";
import {EXECUTING, SUCCESS} from "../../core/api/actionTypes";
import axios from "axios";
import _ from 'lodash';
import config from "react-global-configuration"


const useReports = () => {
    const [reports, setReports] = useState({
        statusFormsPerEnvCount: EXECUTING,
        activeIndex: 0,
        formsPerEnvCount: [],
        typeData: [],
        statusTypeData: EXECUTING
    });
    const environments = config.get('environments');

    useEffect(() => {
        const fetchReportData = async () => {
            const perEnvResults = await axios.all(environments.map(async (environment) => {
                const response = await axios(`${environment.url}/form?select=_id&display__in=form,wizard&limit=1&type__ne=resource`);
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
                const formTypes = await axios(`${environment.url}/form?select=_id&display=form&limit=1&type__ne=resource`);
                const wizardTypes = await axios(`${environment.url}/form?select=_id&display=wizard&limit=1&type__ne=resource`);
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
        fetchReportData();
    }, [environments]);

    return {
        reports
    }
};

export default useReports;
