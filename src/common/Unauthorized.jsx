import React from 'react';
import {Container, Icon, Message} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

const Unauthorized = () => {
    const {t} = useTranslation();
    return <Container><Message negative size='massive' icon>
        <Icon name='exclamation circle'/>
        <Message.Content>
            <Message.Header>Unauthorized</Message.Header>
            <p>{t('error.not-authorized')}</p>
        </Message.Content>
    </Message></Container>
};

export default Unauthorized;
