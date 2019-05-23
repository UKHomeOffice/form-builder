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

const useGetForms = () => {
    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {t} = useTranslation();
    const [forms, setValues] = useState({
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
        refresh: false,
        downloadFile: {
            formId: null,
            formName: null
        }
    });


    const [searchTitle] = useDebouncedCallback(
        (value) => {
            setValues(forms => ({
                ...forms,
                activePage: 1,
                searchTitle: value
            }))
        },
        500,
        { maxWait: 2000 }
    );

    const [{status, response}, makeRequest] = useApiRequest(
        `/form?select=title,path,name,display,created,modified${forms.activePage !== 1 ? `&skip=${((forms.activePage - 1) * forms.limit)}` : ''}${forms.searchTitle !== '' && forms.searchTitle !== '<>' ? `&title__regex=/^${forms.searchTitle}/i` : ''}`, {
            verb: 'get', params: {}
        }
    );


    const [wizardCountState, wizardStatsRequest] = useApiRequest(
        `/form?select=_id&display=wizard&limit=1&type__ne=resource`, {
            verb: 'get', params: {}
        }
    );

    const [formCountState, formStatsRequest] = useApiRequest(
        `/form?select=_id&display=form&limit=1&type__ne=resource`, {
            verb: 'get', params: {}
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


    useEffect(() => {
        savedCallback.current = () => {
            setValues(forms => ({
                ...forms,
                data: null
            }));
            makeRequest();
            wizardStatsRequest();
            formStatsRequest();
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
    }, [forms.activePage, forms.searchTitle, forms.refresh, envContext]);


    useEffect(() => {
        if (status === SUCCESS) {
            setValues(forms => ({
                ...forms,
                refresh: false,
                data: response.data,
                total: parseInt(response.headers['content-range'].split('/')[1])
            }));
        }
    }, [response, status, setValues]);


    useEffect(() => {
        if (wizardCountState.status === SUCCESS) {
            setValues(forms => ({
                ...forms,
                numberOfWizards: parseInt(wizardCountState.response.headers['content-range'].split('/')[1])
            }));
        }
    }, [wizardCountState, setValues]);

    useEffect(() => {
        if (formCountState.status === SUCCESS) {
            setValues(forms => ({
                ...forms,
                numberOfForms: parseInt(formCountState.response.headers['content-range'].split('/')[1])
            }));
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
        setValues(forms => ({
            ...forms,
            refresh: true
        }));
    };

    const handleTitleSearch = (e, data) => {
        searchTitle(data.value);
    };

    const handlePreview = (form) => {
        navigation.navigate(`/forms/${envContext.id}/${form._id}/preview`, {replace: true});
    };

    const handleEditForm = (form) => {
        navigation.navigate(`/forms/${envContext.id}/${form._id}/edit`, {replace: true});

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

    const handlePromotion = (form) => {
        navigation.navigate(`/forms/${envContext.id}/${form._id}/promote`, {replace: true});
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
        handlePromotion
    }
};

export default useGetForms;
