import useEnvContext from "../../../core/context/useEnvContext";
import {useEffect, useRef, useState} from "react";
import {useMultipleApiCallbackRequest} from "../../../core/api";
import {SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import useLogger from "../../../core/logging/useLogger";
import {toast} from "react-semantic-toasts";
import {useTranslation} from "react-i18next";

const useMigrations = () => {
        const {clearEnvContext, getEnvDetails} = useEnvContext();
        const {log} = useLogger();
        const {t} = useTranslation();
        const [formio, setFormio] = useState({
            url: 'https://formio.elf79.dev',
            username: 'me@lodev.xyz',
            password: 'secret',
            environment: '',
            forms: [],
            total: 0,
            limit: 10,
            numberOnPage: 0,
            activePage: 1,
            formsIdsForMigration: [],
            open: false

        });
        const savedCallback = useRef();

        const [migrationState, migrateRequest] = useMultipleApiCallbackRequest(async (axios) => {
            const envContext = getEnvDetails(formio.environment);
            const santize = (form) => {
                return _.omit(form, ['submissionAccess', 'access', 'machineName', '_id', 'tags', 'created', 'modified']);
            };
            const formsSuccessfullyMigrated = [];
            const formsFailedToMigrate = [];
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


            for await (const formId of formio.formsIdsForMigration) {
                const form = await axios({
                    method: 'GET',
                    url: `${formio.url}/form/${formId}`,
                    headers: {
                        "Content-Type": "application/json",
                        'x-jwt-token': tokenResponse.headers['x-jwt-token']
                    },
                });
                try {
                    const response = await axios({
                        url: `${envContext.url}/form`,
                        method: 'POST',
                        data: santize(form.data)
                    });

                    if (response.status === 201) {
                        formsSuccessfullyMigrated.push(form.data.name);
                    } else {
                        log([{
                            message: `Failed to migrate ${formId}`,
                            exception: response.data,
                            level: 'error'
                        }]);
                        formsFailedToMigrate.push(form.data.name);
                    }
                } catch (e) {
                    log([{
                        message: `Failed to migrate ${formId}`,
                        exception: e.response.data,
                        status: e.status,
                        level: 'error'
                    }]);
                    formsFailedToMigrate.push(form.data.name);
                }
            }

            return Promise.resolve({
                data: {
                    formsSuccessfullyMigrated: formsSuccessfullyMigrated,
                    formsFailedToMigrate: formsFailedToMigrate
                }
            });
        }, [], [], getEnvDetails(formio.environment));

        const [{status, response}, makeRequest] = useMultipleApiCallbackRequest(async (axios) => {
                const envContext = getEnvDetails(formio.environment);
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
                        url: `${formio.url}/form?&limit=${formio.limit}${formio.activePage !== 1 ? `&skip=${((formio.activePage - 1) * formio.limit)}` : ''}`,
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
                                return form;
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
            }], getEnvDetails(formio.environment)
        );


        useEffect(() => {
            savedCallback.current = () => {
                setFormio(formio => ({
                    ...formio,
                    data: null,
                    total: 0,
                    numberOnPage: 0
                }));
                makeRequest();
            };
        });

        useEffect(() => {
            clearEnvContext();
        }, []);

        useEffect(() => {
            if (formio.environment) {
                savedCallback.current();
            }
        }, [formio.activePage]);

        useEffect(() => {
            if (status === SUCCESS) {
                setFormio(formio => ({
                    ...formio,
                    forms: response.data,
                    numberOnPage: response.data.length,
                    total: parseInt(response.headers['content-range'].split('/')[1])
                }));
            }
        }, [status, setFormio, formio, response]);


        useEffect(() => {
            if (migrationState.status === SUCCESS) {
                for (const failedForm of migrationState.response.data.formsFailedToMigrate) {
                    toast({
                        type: 'warning',
                        icon: 'exclamation circle',
                        title: t('migration.failure.title'),
                        description: t('migration.failure.description', {formName: failedForm}),
                        animation: 'scale',
                        time: 5000
                    });
                }
                for (const successfulForm of migrationState.response.data.formsSuccessfullyMigrated) {
                    toast({
                        type: 'success',
                        icon: 'check circle',
                        title: t('migration.success.title'),
                        description: t('migration.success.description', {formName: successfulForm}),
                        animation: 'scale',
                        time: 5000
                    });
                }
                makeRequest();
            }
        }, [migrationState]);

        const loadForms = () => {
            makeRequest();
        };

        const hasValue = (value) => {
            return value && value !== '';
        };

        const formInValid = () => {
            return !hasValue(formio.url) || !hasValue(formio.username) || !hasValue(formio.password) || !hasValue(formio.environment);
        };
        const handlePaginationChange = (e, {activePage}) => {
            setFormio(formio => ({
                ...formio,
                activePage: activePage
            }));
        };

        const handleCancelMigration = () => {
            setFormio(formio => ({
                ...formio,
                open: false
            }));
        };

        const handleConfirmMigration = () => {
            setFormio(formio => ({
                ...formio,
                open: false
            }));
            migrateRequest();
        };


        return {
            loadForms,
            status,
            formio,
            setFormio,
            formInValid,
            handlePaginationChange,
            handleCancelMigration,
            handleConfirmMigration,
            migrationState
        }
    }
;

export default useMigrations;
