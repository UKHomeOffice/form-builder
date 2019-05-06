import {mount, route} from 'navi'

import CreateFormBuilder from "./components/CreateFormBuilder";
import CreateFormFileUpload from "./components/CreateFormFileUpload";
import React from "react";
import CreateFormChoice from "./components/CreateFormChoice";


export default mount({
    '/': route({
        title: 'Create Form',
        view: <CreateFormChoice/>
    }),
    '/builder': route({
        title: 'Create form with builder',
        view: <CreateFormBuilder/>
    }),
    '/file-upload': route({
        title: 'Create form via file upload',
        view: <CreateFormFileUpload/>
    })
});


