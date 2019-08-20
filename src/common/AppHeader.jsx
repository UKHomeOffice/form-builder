import React from 'react';
import {useTranslation} from "react-i18next";
import useEnvContext from "../core/context/useEnvContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons";

const AppHeader = () => {
    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const environment = envContext;
    if (environment) {
        const label = environment.label;
        return <div className="center-context" style={{width: '100hv', marginTop:'1rem'}}>
            <h2 data-cy="context-label" className="display-5"><FontAwesomeIcon
                icon={faCog}/> {t('environment.label')}: <span style={environment.editable ? {'color': '#5bc0eb'} : {'color': '#dc3545'}} className={environment.editable ? 'context-border-teal' : 'context-border-red'}>{label ? label : environment.id}</span>
            </h2>

        </div>
    }
    return null;
};

export default AppHeader;
