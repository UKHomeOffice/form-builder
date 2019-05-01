import React from 'react';
import {mount, route} from 'navi'
import CreateNewForm from "./components/CreateNewForm";

export default mount({
    '/': route({
        title: 'Create Form',
        view: <CreateNewForm/>
    })
});
