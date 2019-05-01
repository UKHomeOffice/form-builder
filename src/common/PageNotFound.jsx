import React from 'react';
import {Message} from "semantic-ui-react";

const PageNotFound = () => (
    <Message negative size='massive'>
        <Message.Header>404</Message.Header>
        <p>Sorry the url you requested does not exist</p>
    </Message>
);

export default PageNotFound;
