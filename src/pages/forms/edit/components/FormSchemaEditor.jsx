import React from 'react';
import Container from "react-bootstrap/Container";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useKeycloak} from "react-keycloak";
import useBeforeUnload from "use-before-unload";
import jwt_decode from "jwt-decode";
import Alert from "./EditFormPage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

const FormSchemaEditor = ({formId}) => {
    const {envContext} = useEnvContext();
    const {keycloak} = useKeycloak();

    useBeforeUnload(evt => {
        const isExpired = jwt_decode(keycloak.refreshToken).exp < new Date().getTime() / 1000;
        return !isExpired;

    });

    if (!envContext.editable) {

        return <Container>
            <Alert variant="warning" className="border-1 mt-2">
                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                    <span className="ml-2">{t('error.general')}</span>
                </Alert.Heading>
                <p className="lead">{t('form.edit.failure.non-editable-environment')}</p>
            </Alert>
        </Container>

    }

    return <React.Fragment>

    </React.Fragment>
};

export default FormSchemaEditor;
