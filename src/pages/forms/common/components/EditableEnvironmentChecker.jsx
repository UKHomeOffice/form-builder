import useEnvContext from "../../../../core/context/useEnvContext";
import {useTranslation} from "react-i18next";
import {Container, Icon, Message} from "semantic-ui-react";
import React from "react";

const EditableEnvironmentChecker = ({children}) => {
    const {envContext} = useEnvContext();
    const {t} = useTranslation();

    if (!envContext) {
        return <Message icon negative>
            <Icon name='exclamation circle'/>
            <Message.Content>
                <Message.Header>{t('error.no-context')}</Message.Header>
                {t('error.no-context-message')}
            </Message.Content>
        </Message>
    }
    if (envContext.editable) {
        return <div>{children}</div>;
    } else {
        return <Container data-cy="not-allowed-to-create"><Message icon negative>
            <Icon name='exclamation circle'/>
            <Message.Content>
                <Message.Header>{t('form.create.not-allowed.title')}</Message.Header>
                {t('form.create.not-allowed.message')}
            </Message.Content>
        </Message></Container>
    }

};

export default EditableEnvironmentChecker;
