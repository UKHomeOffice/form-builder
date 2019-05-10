import {useNavigation} from "react-navi";
import {useEffect, useRef, useState} from "react";
import _ from "lodash";
import useApiRequest from "../../../core/api";
import {SUCCESS} from "../../../core/api/actionTypes";
import useEnvContext from "../../../core/context/useEnvContext";

const useGetForms = () => {
    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const [forms, setValues] = useState({
        column: null,
        direction: null,
        data: null,
        total: 0,
        activePage: 1,
        limit: 10,
        searchTitle: ''
    });


    const [{status, response}, makeRequest] = useApiRequest(
        `/form?select=title,path,name,display${forms.activePage !== 1 ?`&skip=${((forms.activePage - 1) * forms.limit)}`: ''}${forms.searchTitle !== '' && forms.searchTitle !== '<>' ? `&title__regex=/^${forms.searchTitle}/i`: '' }`, {
            verb: 'get', params:{}
        }
    );

    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = () => {
            setValues(forms => ({
                ...forms,
                data: null
            }));
            makeRequest();
        };
    });

    useEffect(() => {
        savedCallback.current();
    }, [forms.activePage, forms.searchTitle]);

    useEffect(() => {
        if (status === SUCCESS) {
            setValues(forms => ({
                ...forms,
                data: response.data,
                total: parseInt(response.headers['content-range'].split('/')[1])
            }));
        }
    }, [response, status, setValues]);

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
            searchTitle: '<>'
        }));
    };

    const handleTitleSearch = (e, data) => {
        setValues(forms=> ({
            ...forms,
            searchTitle: data.value
        }))
    };

    const handlePreview = (form) => {
        navigation.navigate(`/forms/${envContext.id}/${form._id}/preview`, {replace: true});
    };

    const handleEditForm = (form) => {
        navigation.navigate(`/forms/${envContext.id}/${form._id}/edit`, {replace: true});

    }

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
        handleEditForm
    }
};

export default useGetForms;
