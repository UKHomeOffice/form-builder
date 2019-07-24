import React, {useEffect, useRef, useState} from "react";
import {Button, Confirm, Container, Icon, Message} from "semantic-ui-react";
import useApiRequest from "../../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../../core/api/actionTypes";
import {useTranslation} from "react-i18next";
import {toast} from "react-semantic-toasts";

const DeleteFormButton = ({form, onSuccessfulDeletion}) => {
    const [open, setOpen] = useState(false);
    const [{status, response}, makeRequest] = useApiRequest(
        `/form/${form.id}`, {verb: 'delete'}
    );
    const { t } = useTranslation();

    const savedCallback = useRef();

    const callback = () => {
        setOpen(false);
        toast({
            type: 'success',
            icon: 'check circle',
            title: `${form.title}`,
            description: t('form.delete.successful', {formName: form.name}),
            animation: 'scale',
            time: 10000
        });
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
        <Button data-cy="delete-form" onClick={() => setOpen(true)} negative>Delete</Button>
        <Confirm
            confirmButton={<Button data-cy="confirm-delete" loading={status === EXECUTING} disabled={status === EXECUTING}
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
