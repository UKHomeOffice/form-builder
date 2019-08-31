import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import _ from "lodash";
import useApiRequest from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";
import fileDownload from 'js-file-download';
import {useTranslation} from "react-i18next";
import {useDebouncedCallback} from "use-debounce";
import axios from "axios";
import eventEmitter from '../../../core/eventEmitter';
import {toast} from "react-toastify";
import uuid from 'uuid4';

const useGetForms = () => {
        const navigation = useNavigation();
        const {envContext} = useEnvContext();
        const {t} = useTranslation();
        const initialState = {
            column: null,
            direction: null,
            data: [],
            total: 0,
            activePage: 0,
            limit: 10,
            searchTitle: '',
            numberOfWizards: 0,
            numberOfForms: 0,
            activeIndex: -1,
            numberOnPage: 0,
            refresh: false,
            filterIndex: -1,
            filterValue: "all",
            filter: null,
            downloadFile: {
                formId: null,
                formName: null
            }
        };

        const isMounted = useRef(true);


        const [forms, setValues] = useState(initialState);


        const [searchTitle] = useDebouncedCallback(
            (value) => {
                setValues(forms => ({
                    ...forms,
                    activePage: 0,
                    activeIndex: -1,
                    searchTitle: value
                }));
            },
            500,
            {maxWait: 2000}
        );

        const CancelToken = axios.CancelToken;

        const wizardCountCancel = useRef(CancelToken.source());
        const formsCountCancel = useRef(CancelToken.source());
        const formsCancel = useRef(CancelToken.source());

        const resolveFilter = () => {
            let baseFilter = "";
            if (forms.searchTitle !== '' && forms.searchTitle !== '<>') {
                baseFilter = `&filter=title__regexp__${forms.searchTitle}${forms.filter ? `,${forms.filter}` : ''}`
            } else {
                if (forms.filter) {
                    baseFilter = `&filter=${forms.filter}`
                }
            }
            return baseFilter;
        };

        const [{status, response, exception}, makeRequest] = useApiRequest(
            `/form?select=title,path,name,display,id&limit=${forms.limit}&offset=${((forms.activePage) * forms.limit)}${resolveFilter()}`, {
                verb: 'get', params: {
                    cancelToken: formsCancel.current.token
                }
            }
        );


        const [wizardCountState, wizardStatsRequest] = useApiRequest(
            `/form?filter=display__eq__wizard&countOnly=true`, {
                verb: 'get', params: {
                    cancelToken: wizardCountCancel.current.token
                }
            }
        );

        const [formCountState, formStatsRequest] = useApiRequest(
            `/form?filter=display__eq__form&countOnly=true`, {
                verb: 'get', params: {
                    cancelToken: formsCountCancel.current.token
                }
            }
        );


        const [downloadFormState, executeDownload] = useApiRequest(
            `/form/${forms.downloadFile.formId}`, {
                verb: 'get', params: {
                    responseType: 'arraybuffer'
                }
            }
        );


        const savedCallback = useRef();
        const handleFailedToLoadFormsCallback = useRef();

        const successfulFormDownloadCallback = useRef();
        const failedFormDownloadCallback = useRef();
        const executeDownloadCallback = useRef();
        const wizardStatsCallback = useRef();
        const formStatsCallback = useRef();
        const resetCallback = useRef();
        const cancelRequests = useRef();


        useEffect(() => {

            handleFailedToLoadFormsCallback.current = () => {
                eventEmitter.publish('error', {
                    id: uuid(),
                    message: t('form.list.failure.forms-load', {error: exception.message})
                })
            };

            savedCallback.current = () => {
                setValues(forms => ({
                    ...forms,
                    data: [],
                    total: 0,
                    numberOnPage: 0
                }));
                makeRequest();
            };

            wizardStatsCallback.current = () => {
                wizardStatsRequest();
            };

            formStatsCallback.current = () => {
                formStatsRequest();
            };

            resetCallback.current = () => {
                setValues(forms => ({
                    ...forms,
                    activePage: 0,
                    filterIndex: -1,
                    filterValue: "all",
                    numberOfForms: 0,
                    numberOfWizards: 0
                }));
            };

            successfulFormDownloadCallback.current = () => {
                fileDownload(downloadFormState.response.data, `${forms.downloadFile.formName}.json`);
                toast.success(`${t('form.download.successful-message', {formName: forms.downloadFile.formName})}`)

            };

            failedFormDownloadCallback.current = () => {
                eventEmitter.publish('error', {
                    id: uuid(),
                    message: `${t('form.download.failed')} - ${t('form.download.failed-message')}`
                });
            };

            executeDownloadCallback.current = () => {
                executeDownload();
            };

            cancelRequests.current = () => {
                const isFormsPath = navigation.getCurrentValue().url.href.startsWith("/forms/");
                if (!isFormsPath) {
                    formsCancel.current.cancel("Cancelling request to get forms");
                    wizardCountCancel.current.cancel("cancelling wizard count stats");
                    formsCountCancel.current.cancel("cancelling form count stats");
                    isMounted.current = false;
                }
            }
        });

        useEffect(() => {
            if (forms.downloadFile.formId) {
                executeDownloadCallback.current();
            }
        }, [forms.downloadFile.formId]);

        useEffect(() => {
            savedCallback.current();
        }, [forms.activePage,
            forms.searchTitle,
            forms.refresh,
            envContext,
            forms.filter]);

        useEffect(() => {
            resetCallback.current();
            wizardStatsCallback.current();
            formStatsCallback.current();
            return () => {
                cancelRequests.current();
            }
        }, [envContext, forms.refresh]);


        useEffect(() => {
            if (status === SUCCESS) {
                if (isMounted.current) {
                    setValues(forms => ({
                        ...forms,
                        refresh: false,
                        data: response.data.forms,
                        numberOnPage: response.data.length,
                        total: response.data.total
                    }));
                }

            } else if (status === ERROR) {
                if (isMounted.current) {
                    handleFailedToLoadFormsCallback.current();
                }
            }
        }, [response, status, setValues]);


        useEffect(() => {
            if (wizardCountState.status === SUCCESS) {
                if (isMounted.current) {
                    setValues(forms => ({
                        ...forms,
                        numberOfWizards: wizardCountState.response.data.total
                    }));
                }
            }
        }, [wizardCountState, setValues]);

        useEffect(() => {
            if (formCountState.status === SUCCESS) {
                if (isMounted.current) {
                    setValues(forms => ({
                        ...forms,
                        numberOfForms: formCountState.response.data.total
                    }));
                }
            }
        }, [formCountState, setValues]);


        useEffect(() => {
            if (downloadFormState.status === SUCCESS) {
                successfulFormDownloadCallback.current();
            }

            if (downloadFormState.status === ERROR) {
                failedFormDownloadCallback.current();
            }
        }, [downloadFormState]);


        const handlePaginationChange = (page) => {
            setValues(forms => ({
                ...forms,
                activeIndex: -1,
                activePage: page
            }));
        };

        const handleSort = clickedColumn => () => {
            const {column, direction, data} = forms;
            if (column !== clickedColumn) {
                setValues(forms => ({
                    ...forms,
                    column: clickedColumn,
                    data: _.sortBy(data, (form) => {
                        return form[clickedColumn] ? form[clickedColumn].toLowerCase() : true;
                    }),
                    direction: 'ascending'
                }));
                return;
            }
            setValues(forms => ({
                ...forms,
                data: data.reverse(),
                column: clickedColumn,
                direction: direction === 'ascending' ? 'descending' : 'ascending'
            }));
        };

        const handleOnSuccessfulDeletion = () => {
            const numberOnPage = forms.numberOnPage - 1;
            setValues(forms => ({
                ...forms,
                refresh: true,
                numberOnPage: numberOnPage,
                activePage: numberOnPage === 0 ? forms.activePage - 1 : forms.activePage
            }));
        };

        const handleTitleSearch = (e, data) => {
            searchTitle(data.value);
        };

        const handlePreview = async (form) => {
            await navigation.navigate(`/forms/${envContext.id}/${form.id}/preview`, {replace: true});
        };

        const handleEditForm = async (form) => {
            await navigation.navigate(`/forms/${envContext.id}/${form.id}/edit`, {replace: true});
        };

        const handleAccordionClick = (e, titleProps) => {
            const {index} = titleProps;
            const {activeIndex} = forms;
            const newIndex = activeIndex === index ? -1 : index;
            setValues(forms => ({
                ...forms,
                activeIndex: newIndex
            }))
        };

        const download = (formId, formName) => {
            setValues(forms => ({
                ...forms,
                downloadFile: {
                    formId: formId,
                    formName: formName
                }
            }));
        };

        const handlePromotion = async (form) => {
            await navigation.navigate(`/forms/${envContext.id}/${form.id}/promote`, {replace: true});
        };

        const filter = (e, {value}) => {
            let filter = null;
            if (value && value !== 'all') {
                filter = `display__eq__${value}`;
            }
            setValues(forms => ({
                ...forms,
                activePage: 1,
                activeIndex: -1,
                filter: filter,
                filterValue: value
            }));
        };


        return {
            handleSort,
            navigation,
            forms,
            status,
            response,
            handleTitleSearch,
            handlePaginationChange,
            handleOnSuccessfulDeletion,
            handlePreview,
            handleEditForm,
            handleAccordionClick,
            download,
            downloadFormState,
            handlePromotion,
            filter,
        }
    }

;

export default useGetForms;
