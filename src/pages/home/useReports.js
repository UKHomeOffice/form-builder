import {useEffect, useState} from "react";
import {EXECUTING, SUCCESS} from "../../core/api/actionTypes";
import axios from "axios";
import environments from '../../environments';
import _ from 'lodash';

const useReports = () => {
    const [reports, setReports] = useState({
        statusFormsPerEnvCount: EXECUTING,
        activeIndex: 0,
        formsPerEnvCount: [],
        typeData: [],
        statusTypeData: EXECUTING
    });


    useEffect(() => {
        const fetchReportData = async () => {
            await axios.all(environments.map(async (environment) => {
                const response = await axios(`${environment.url}/form?select=_id&display__in=form,wizard&limit=1&type__ne=resource`);
                return {
                    environment: environment,
                    response: response
                }
            })).then((results) => {
                const formsCountData = _.map(results, (result) => {
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
            });

            await axios.all(environments.map(async (environment) => {
                const formTypes = await axios(`${environment.url}/form?select=_id&display=form&limit=1&type__ne=resource`);
                const wizardTypes = await axios(`${environment.url}/form?select=_id&display=wizard&limit=1&type__ne=resource`);
                return {
                    environment: environment.id,
                    formTypes: formTypes,
                    wizardTypes: wizardTypes
                }
            })).then((results) => {
                const typeData = _.map(results, (result) => {
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
            });


        };
        fetchReportData();
    }, []);


    const onPieEnter = (data, index) => {
        setReports(reports => ({
            ...reports,
            activeIndex: index
        }));
    };


    return {
        reports,
        onPieEnter
    }
};

export default useReports;
