import useEnvContext from "../../../core/context/useEnvContext";
import {useEffect, useRef, useState} from "react";
import {useProxyApiRequest} from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import _ from 'lodash';
import {useTranslation} from "react-i18next";
import {useDebouncedCallback} from "use-debounce";
import eventEmitter from '../../../core/eventEmitter';
import uuid4 from "uuid4";
import {useToasts} from "react-toast-notifications";

const useMigrations = () => {
        const {clearEnvContext, getEnvDetails} = useEnvContext();
        const {t} = useTranslation();
        const {addToast} = useToasts();
        const [formio, setFormio] = useState({
            url: '',
            username: '',
            password: '',
            environment: '',
            forms: [],
            total: 0,
            limit: 10,
            numberOnPage: 0,
            activePage: 0,
            formsIdsForMigration: [],
            searchTitle: '',
            open: false

        });
        const savedCallback = useRef();
        const handleMigrationCallback = useRef();
        const failedToLoadFormsCallback = useRef();
        const clearContextCallback = useRef();

        const [searchTitle] = useDebouncedCallback(
            (value) => {
                setFormio(formio => ({
                    ...formio,
                    activePage: 0,
                    searchTitle: value
                }));
            },
            100,
            {maxWait: 2000}
        );

        const [migrationState, migrateRequest] = useProxyApiRequest(`/ui/migrate`, {
            verb: 'post', params: {
                formio: {
                    password: formio.password,
                    url: formio.url,
                    username: formio.username
                },
                env: getEnvDetails(formio.environment),
                formsIdsForMigration: formio.formsIdsForMigration
            }
        });


        const [{status, response, exception}, makeRequest] = useProxyApiRequest(`/ui/load-migration-forms`, {
            verb: 'post',
            params: {
                formio: {
                    password: formio.password,
                    url: formio.url,
                    username: formio.username,
                    activePage: formio.activePage,
                    limit: formio.limit,
                    searchTitle: formio.searchTitle
                },
                env: getEnvDetails(formio.environment)
            }
        });

        useEffect(() => {
            clearContextCallback.current = () => {
                clearEnvContext();
            };
            savedCallback.current = () => {
                if (formio.environment) {
                    setFormio(formio => ({
                        ...formio,
                        data: null,
                        total: 0,
                        numberOnPage: 0
                    }));

                    makeRequest();
                }
            };

            failedToLoadFormsCallback.current = () => {
                eventEmitter.publish('error', {
                    exception: exception,
                    response: response,
                    message: 'Failed to load forms from FormIO Server'
                });
            };
            handleMigrationCallback.current = () => {
                for (const failedForm of migrationState.response.data.formsFailedToMigrate) {

                    eventEmitter.publish('error', {
                        id: uuid4(),
                        message: t('migration.failure.description', {formName: failedForm.name})
                    });

                }
                for (const successfulForm of migrationState.response.data.formsSuccessfullyMigrated) {
                    const selectedFormIds = formio.formsIdsForMigration;
                    _.remove(selectedFormIds, (id) => {
                        return id === successfulForm.formId
                    });
                    setFormio(formio => ({...formio, formsIdsForMigration: selectedFormIds}));

                    addToast(`${t('migration.success.description', {formName: successfulForm.name})}`, {
                        appearance: 'success',
                        autoDismiss: true,
                        id: uuid4()
                    });

                }
                makeRequest();
                eventEmitter.publish('enable-navigation', {});
            }
        });

        useEffect(() => {
            clearContextCallback.current();
        }, []);

        useEffect(() => {
            savedCallback.current();
        }, [formio.activePage, formio.searchTitle]);

        useEffect(() => {
            if (status === SUCCESS) {
                setFormio(formio => ({
                    ...formio,
                    forms: response.data,
                    numberOnPage: response.data.length,
                    total: parseInt(response.headers['content-range'].split('/')[1])
                }));
            }
            if (status === ERROR) {
                failedToLoadFormsCallback.current();
            }
        }, [status, setFormio, formio, response]);


        useEffect(() => {
            if (migrationState.status === SUCCESS) {
                handleMigrationCallback.current();
            }
        }, [migrationState]);

        const loadForms = () => {
            setFormio(formio => ({
                ...formio,
                searchTitle: ''
            }));
            makeRequest();
        };

        const hasValue = (value) => {
            return value && value !== '';
        };

        const formInValid = () => {
            return !hasValue(formio.url) || !hasValue(formio.username) || !hasValue(formio.password) || !hasValue(formio.environment);
        };
        const handlePaginationChange = (activePage) => {
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
            eventEmitter.publish('disable-navigation', {});
            migrateRequest();
        };

        const handleTitleSearch = (e, data) => {
            searchTitle(data.value);
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
            migrationState,
            handleTitleSearch
        }
    }
;

export default useMigrations;
