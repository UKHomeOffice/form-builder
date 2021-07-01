import {useContext, useEffect, useRef, useState} from "react";
import {EXECUTING, SUCCESS} from "../../core/api/actionTypes";
import axios from "axios";
import useEnvContext from "../../core/context/useEnvContext";
import {ApplicationContext} from "../../core/AppRouter";
import {useKeycloak} from "react-keycloak";
import qs from "querystring";
import appConfig from 'react-global-configuration';

const useReports = () => {
    const [keycloak] = useKeycloak();

    const [reports, setReports] = useState({
        statusFormsPerEnvCount: EXECUTING,
        activeIndex: 0,
        formsPerEnvCount: [],
        typeData: [],
        statusTypeData: EXECUTING
    });
    const {clearEnvContext} = useEnvContext();
    const {state, setState} = useContext(ApplicationContext);

    const isMounted = useRef(true);

    const fetchReportsCallback = useRef();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const cancelTokenRef = useRef(source);
    const callback = async () => {
        clearEnvContext();
        if (state.activeMenuItem) {
            setState(state => ({
                ...state,
                activeMenuItem: null
            }));
        }

        const keycloakConfig = appConfig.get('keycloak');
        console.log(`${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`);
        const accessToken = await axios({
            method: 'POST',
            url: `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: qs.stringify({
                grant_type: 'refresh_token',
                client_id: keycloakConfig.clientId,
                refresh_token: keycloak.refreshToken
            })
        });
        axios.get("/ui/reports", {
            cancelToken: source.token,
            headers: {
                'Authorization': `Bearer ${accessToken.data.access_token}`
            }
        }).then((response) => {
            if (isMounted.current) {
                setReports(reports => ({
                    ...reports,
                    statusFormsPerEnvCount: SUCCESS,
                    statusTypeData: SUCCESS,
                    formsPerEnvCount: response.data.formsCountData,
                    typeData: response.data.typeData
                }));
            }
        });


    };

    useEffect(() => {
        fetchReportsCallback.current = callback;
    });
    useEffect(() => {
        const fetch = async () => {
            await fetchReportsCallback.current();
        };
        fetch();
        const cancelRef = cancelTokenRef.current;
        return () => {
            isMounted.current = false;
            cancelRef.cancel("Cancelling API request");
        }
    }, []);
    return {
        reports,

    }
};

export default useReports;
