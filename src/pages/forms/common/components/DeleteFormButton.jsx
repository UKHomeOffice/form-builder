import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Confirm, Container, Icon, Message} from "semantic-ui-react";
import useApiRequest from "../../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../../core/api/actionTypes";
import {ApplicationContext} from "../../../../core/Main";
import {useTranslation} from "react-i18next";

const DeleteFormButton = ({form, onSuccessfulDeletion}) => {
    const {setState} = useContext(ApplicationContext);
    const [open, setOpen] = useState(false);
    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${form._id}`, {verb: 'delete'}
    );
    const { t } = useTranslation();

    const savedCallback = useRef();

    const callback = () => {
        setOpen(false);
        setState(state => ({
            ...state, notification: {
                header: `${form.title}`,
                content: t('form.delete.successful', {formName: form.name})
            },
        }));
        onSuccessfulDeletion()
    };

    useEffect(() => {
        savedCallback.current = callback;
    });
    useEffect(() => {
        if (status === SUCCESS) {
            savedCallback.current();
        }
    }, [status]);


    const content = <Container>{status === EXECUTING ?
        <Message icon>
            <Icon name='circle notched' loading/>
            <Message.Content>
                <Message.Header>{t('form.delete.message.header')}</Message.Header>
                {t('form.delete.message.content')}
            </Message.Content>
        </Message>
        : (status === ERROR ? <Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>{t('error.general')}</Message.Header>
                {t('form.delete.failure.failed-to-delete', {formName: form.name, error: JSON.stringify(response.data)})}
            </Message.Content>
        </Message> : (status === SUCCESS ? <Message icon positive>
            <Icon name='check circle outline'/>
            <Message.Content>
                <Message.Header>Success</Message.Header>
                {t('form.delete.successful', {formName: form.name})}
            </Message.Content>
        </Message>: null))}</Container>;

    return (<React.Fragment>
        <Button onClick={() => setOpen(true)} negative>Delete</Button>
        <Confirm
            confirmButton={<Button loading={status === EXECUTING} disabled={status === EXECUTING}
                                   negative>{t('form.list.delete-label')}</Button>}
            open={open}
            header={t('form.delete.confirm', {formName: form.name})}
            content={content}
            onCancel={() => setOpen(false)}
            onConfirm={makeRequest}
            size="large"/>
    </React.Fragment>);

};

export default DeleteFormButton;
