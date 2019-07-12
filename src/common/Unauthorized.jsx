import React from 'react';
import {Container, Message} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

const Unauthorized = () => {
    const {t} = useTranslation();
    return <Container><Message negative size='massive'>
        <Message.Header>403</Message.Header>
        <p>{t('error.not-authorized')}</p>
    </Message></Container>
};

export default Unauthorized;
