import useEnvContext from "../../../core/context/useEnvContext";
import {useEffect, useState} from "react";
import {useMultipleApiCallbackRequest} from "../../../core/api";
import {SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';

const useMigrations = () => {
        const {clearEnvContext, envContext} = useEnvContext();


        const [formio, setFormio] = useState({
            url: 'https://formio.elf79.dev',
            username: 'me@lodev.xyz',
            password: 'secret',
            environment: '',
            forms: [],
            limit: 20,
            activePage: 1,
            formsIdsForMigration: []

        });

        const [{status, response}, makeRequest] = useMultipleApiCallbackRequest(async (axios) => {
                try {
                    const tokenResponse = await axios({
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method: 'POST',
                        url: `${formio.url}/user/login`,
                        data: {
                            data: {
                                email: formio.username,
                                password: formio.password
                            }
                        }
                    });
                    const responseFromFormio = await axios({
                        headers: {
                            "Content-Type": "application/json",
                            'x-jwt-token': tokenResponse.headers['x-jwt-token']
                        },
                        url: `${formio.url}/form?select=title,path,name,display,created,modified&limit=${formio.limit}${formio.activePage !== 1 ? `&skip=${((formio.activePage - 1) * formio.limit)}` : ''}`,
                        method: 'GET',
                    });

                    if (responseFromFormio.data) {
                        const names = responseFromFormio.data.map((form) => {
                            return form.name;
                        });

                        const existing = await axios({
                            url: `${envContext.url}/form?select=name&filter=name__in__${names.join('|')}`,
                            method: 'GET',
                        });

                        if (existing.data.total !== 0) {
                            responseFromFormio.data.map((form) => {
                                const found = _.find(existing.data.forms, (f) => {
                                    return f.name === form.name;
                                });
                                if (found) {
                                    form['exists'] = true;
                                }
                            })
                        }

                        return responseFromFormio;
                    }

                    return Promise.resolve({
                        data: []
                    })

                } catch (error) {
                    throw {
                        response: {
                            data: error
                        }
                    }
                }
            }, [{
                message: `Loading forms for migration`,
                level: 'info'
            }], [{
                message: `Forms successfully loaded`,
                level: 'info',
            }]
        );

        useEffect(() => {
            clearEnvContext();
        }, []);

        useEffect(() => {
            if (status === SUCCESS) {
                setFormio(formio => ({
                    ...formio,
                    forms: response.data
                }));
            }
        }, [status, setFormio, formio, response]);
        const loadForms = () => {

            makeRequest();
        };


        const hasValue = (value) => {
            return value && value !== '';
        };

        const formInValid = () => {
            return !hasValue(formio.url) || !hasValue(formio.username) || !hasValue(formio.password) || !hasValue(formio.environment);
        };
        return {
            loadForms,
            status,
            formio,
            setFormio,
            formInValid
        }
    }
;

export default useMigrations;
