import {useRef, useState} from "react";

const useGetVersions = (formId) => {
    const initialState = {
        limit: 10,
        activePage: 1,
        data: null,
        total: 0,
    };
    const isMounted = useRef(true);
    const [versions, setVersions] = useState(initialState);
    return {
        versions
    }
};

export default useGetVersions;
