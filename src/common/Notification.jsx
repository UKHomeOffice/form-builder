import React, {useContext} from 'react';
import {Message} from "semantic-ui-react";
import {ApplicationContext} from "../core/AppRouter";

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
