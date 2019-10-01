import React from 'react';
import {useTranslation} from "react-i18next";
import Container from "react-bootstrap/Container";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";

const Unauthorized = () => {
    const {t} = useTranslation();
    return <Container>
        <Alert variant="danger" className="border-1 mt-2">
            <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                <span className="ml-2">Unauthorized</span>
            </Alert.Heading>
            <p className="lead">{t('error.not-authorized')}</p>
        </Alert>
    </Container>
};

export default Unauthorized;
