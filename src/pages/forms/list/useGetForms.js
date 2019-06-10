import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import _ from "lodash";
import useApiRequest from "../../../core/api";
import {ERROR, SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";
import fileDownload from 'js-file-download';
import {toast} from "react-semantic-toasts";
import {useTranslation} from "react-i18next";
import {useDebouncedCallback} from "use-debounce";
import {useKeycloak} from "react-keycloak";
import config from "react-global-configuration"
import axios from "axios";

const useGetForms = () => {
    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {t} = useTranslation();
    const [keycloak] = useKeycloak();

    const initialState = {
        column: null,
        direction: null,
        data: null,
        total: 0,
        activePage: 1,
        limit: 10,
        searchTitle: '',
        numberOfWizards: 0,
        numberOfForms: 0,
        activeIndex: -1,
        numberOnPage: 0,
        refresh: false,
        filterIndex: -1,
        filterValue: "all",
        filter: "type__ne=resource",
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
                activePage: 1,
                searchTitle: value
            }))
        },
        500,
        {maxWait: 2000}
    );

    const CancelToken = axios.CancelToken;

    const wizardCountCancel = useRef(CancelToken.source());
    const formsCountCancel = useRef(CancelToken.source());
    const formsCancel = useRef(CancelToken.source());

    const [{status, response}, makeRequest] = useApiRequest(
        `/form?select=title,path,name,display,created,modified&${forms.filter}&limit=${forms.limit}${forms.activePage !== 1 ? `&skip=${((forms.activePage - 1) * forms.limit)}` : ''}${forms.searchTitle !== '' && forms.searchTitle !== '<>' ? `&title__regex=/${forms.searchTitle}/i` : ''}`, {
            verb: 'get', params: {
                cancelToken: formsCancel.current.token
            }
        }
    );


    const [wizardCountState, wizardStatsRequest] = useApiRequest(
        `/form?select=_id&display=wizard&type__ne=resource`, {
            verb: 'get', params: {
                cancelToken: wizardCountCancel.current.token
            }
        }
    );

    const [formCountState, formStatsRequest] = useApiRequest(
        `/form?select=_id&type__ne=resource&display__ne=wizard`, {
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

    const successfulFormDownloadCallback = useRef();
    const failedFormDownloadCallback = useRef();
    const executeDownloadCallback = useRef();
    const wizardStatsCallback = useRef();
    const formStatsCallback = useRef();
    const resetCallback = useRef();


    useEffect(() => {
        savedCallback.current = () => {
            setValues(forms => ({
                ...forms,
                data: null,
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
                activePage: 1,
                filterIndex: -1,
                filterValue: "all",
                filter: "type__ne=resource",
                numberOfForms: 0,
                numberOfWizards: 0
            }));
        };

        successfulFormDownloadCallback.current = () => {
            fileDownload(downloadFormState.response.data, `${forms.downloadFile.formName}.json`);
            toast({
                type: 'success',
                icon: 'check circle',
                title: t('form.download.successful'),
                description: t('form.download.successful-message', {formName: forms.downloadFile.formName}),
                animation: 'scale',
                time: 5000
            });
        };

        failedFormDownloadCallback.current = () => {
            toast({
                type: 'warning',
                icon: 'exclamation circle',
                title: t('form.download.failed'),
                description: t('form.download.failed-message'),
                animation: 'scale',
                time: 5000
            });
        };

        executeDownloadCallback.current = () => {
            executeDownload();
        }
    });

    useEffect(() => {
        if (forms.downloadFile.formId) {
            executeDownloadCallback.current();
        }
    }, [forms.downloadFile.formId]);

    useEffect(() => {
        savedCallback.current();
    }, [forms.activePage, forms.searchTitle, forms.refresh, envContext, forms.filter]);

    useEffect(() => {
        resetCallback.current();
        wizardStatsCallback.current();
        formStatsCallback.current();
        const wizard = wizardCountCancel.current;
        const forms = formsCountCancel.current;
        const formsLoad = formsCancel.current;
        return () => {
            formsLoad.cancel("Cancelling request to get forms");
            wizard.cancel("cancelling wizard count stats");
            forms.cancel("cancelling form count stats");
            isMounted.current = false;
        }
    }, [envContext, forms.refresh]);


    useEffect(() => {
        if (status === SUCCESS) {
            if (isMounted.current) {
                setValues(forms => ({
                    ...forms,
                    refresh: false,
                    data: response.data,
                    numberOnPage: response.data.length,
                    total: parseInt(response.headers['content-range'].split('/')[1])
                }));
            }

        }
    }, [response, status, setValues]);


    useEffect(() => {
        if (wizardCountState.status === SUCCESS) {
            if (isMounted.current) {
                setValues(forms => ({
                    ...forms,
                    numberOfWizards: parseInt(wizardCountState.response.headers['content-range'].split('/')[1])
                }));
            }
        }
    }, [wizardCountState, setValues]);

    useEffect(() => {
        if (formCountState.status === SUCCESS) {
            if (isMounted.current) {
                setValues(forms => ({
                    ...forms,
                    numberOfForms: parseInt(formCountState.response.headers['content-range'].split('/')[1])
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


    const handlePaginationChange = (e, {activePage}) => {
        setValues(forms => ({
            ...forms,
            activePage: activePage
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
        await navigation.navigate(`/forms/${envContext.id}/${form._id}/preview`, {replace: true});
    };

    const handleEditForm = async (form) => {
        await navigation.navigate(`/forms/${envContext.id}/${form._id}/edit`, {replace: true});
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
        await navigation.navigate(`/forms/${envContext.id}/${form._id}/promote`, {replace: true});
    };

    const filter = (e, {value}) => {
        let filter = "";
        if (value === 'wizard') {
            filter = "display=wizard&type__ne=resource";
        } else if (value === 'form') {
            filter = "type__ne=resource&display__ne=wizard";
        } else {
            filter = "type__ne=resource";
        }

        setValues(forms => ({
            ...forms,
            filter: filter,
            filterValue: value
        }));
    };

    const handleFilterAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {filterIndex} = forms;
        const newIndex = filterIndex === index ? -1 : index;
        setValues(forms => ({
            ...forms,
            filterIndex: newIndex
        }));
    };


    const canPromote = () => {
        const roles = keycloak.tokenParsed.realm_access.roles;
        return _.intersectionWith(config.get('keycloak.promotion-roles'), roles).length >= 1;
    };

    const canEdit = () => {
        const roles = keycloak.tokenParsed.realm_access.roles;
        return _.intersectionWith(config.get('keycloak.edit-roles'), roles).length >= 1;
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
        handleFilterAccordion,
        canEdit,
        canPromote
    }
};

export default useGetForms;
