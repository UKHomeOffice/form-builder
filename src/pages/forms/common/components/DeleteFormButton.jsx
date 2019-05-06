import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Confirm, Container, Icon, Message} from "semantic-ui-react";
import useApiRequest from "../../../../core/api";
import {ERROR, EXECUTING, SUCCESS} from "../../../../core/api/actionTypes";
import {ApplicationContext} from "../../../../core/Main";

const DeleteFormButton = ({form}) => {
    const {setState} = useContext(ApplicationContext);
    const [open, setOpen] = useState(false);
    const [{status, response}, makeRequest] = useApiRequest(
        `${process.env.REACT_APP_FORMIO_URL}/form/${form._id}`, {verb: 'delete'}
    );

    const savedCallback = useRef();

    const callback = () => {
        setOpen(false);
        setState(state => ({
            ...state, notification: {
                header: `${form.title}`,
                content: `${form.name} has been successfully deleted`
            }
        }));
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
                <Message.Header>Just one second</Message.Header>
                Deleting form...
            </Message.Content>
        </Message>
        : (status === ERROR ? <Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>Error</Message.Header>
                {`Failed to delete ${form.name} due to ${JSON.stringify(response.data)}`}
            </Message.Content>
        </Message> : null)}</Container>;

    return (<React.Fragment>
        <Button onClick={() => setOpen(true)} negative>Delete</Button>
        <Confirm
            confirmButton={<Button loading={status === EXECUTING} disabled={status === EXECUTING}
                                   negative>Delete</Button>}
            open={open}
            header={`Are you sure you wish to delete ${form.name}?`}
            content={content}
            onCancel={() => setOpen(false)}
            onConfirm={makeRequest}
            size="large"/>
    </React.Fragment>);

};

export default DeleteFormButton;