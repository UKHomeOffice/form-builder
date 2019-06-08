import React from 'react';
import {Container, Message} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

const PageNotFound = () => {
    const {t} = useTranslation();
    return <Container><Message negative size='massive'>
        <Message.Header>404</Message.Header>
        <p>{t('error.not-found')}</p>
    </Message></Container>
};
export default PageNotFound;
