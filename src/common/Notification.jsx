import React, {useContext} from 'react';
import {NotificationContext} from '../core/Main';
import {Message} from "semantic-ui-react";

const Notification = () => {
    const [notification, setNotification] = useContext(NotificationContext);
    const close = () => {
        setNotification(notification => ({
            notification, header: null,
            content: null
        }));
    };
    if (notification && (notification.header && notification.content)) {
        return <Message
            onDismiss={close}
            success
            header={notification.header}
            content={notification.content}
        />
    }
    return null;
};

export default Notification;
