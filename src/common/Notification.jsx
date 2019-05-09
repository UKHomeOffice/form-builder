import React, {useContext} from 'react';
import {ApplicationContext} from '../core/Main';
import {Message} from "semantic-ui-react";

const Notification = () => {
    const {state, setState} = useContext(ApplicationContext);
    const close = () => {
        setState(state => ({
            ...state, notification: null
        }));
    };
    if (state && (state.notification)) {
        return <Message
            onDismiss={close}
            success
            header={state.notification.header}
            content={state.notification.content}
        />
    }
    return null;
};

export default Notification;
