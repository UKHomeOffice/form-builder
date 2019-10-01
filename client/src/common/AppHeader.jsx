import React from 'react';
import {useTranslation} from "react-i18next";
import useEnvContext from "../core/context/useEnvContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";

const AppHeader = () => {
    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const environment = envContext;
    if (environment) {
        const label = environment.label;
        return <div className="center-context" style={{width: '100hv', marginTop:'1rem'}}>
            <h2 data-cy="context-label" className="display-5"><FontAwesomeIcon
                icon={faCog}/> {t('environment.label')}: <Badge variant={environment.editable ? 'info' : 'danger'}
                                                                data-cy="context-label">{label ? label : environment.id}</Badge>
            </h2>

        </div>
    }
    return null;
};

export default AppHeader;
