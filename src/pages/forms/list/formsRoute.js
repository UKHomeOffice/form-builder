import React from 'react';
import {mount, route} from 'navi'
import FormList from "./components/FormList";

export default mount({
    '/': route({
        "title" : "Forms",
        "view": <FormList/>
    })
})
