import {mount, route} from 'navi'

import CreateFormPage from "./components/CreateFormPage";
import CreateFormFileUpload from "./components/CreateFormFileUpload";
import React from "react";
import CreateFormChoice from "./components/CreateFormChoice";
import EditableEnvironmentChecker from "../common/components/EditableEnvironmentChecker";
import {withEnvContext} from "../../../core/AppRouter";


export default mount({
    '/': withEnvContext(route({
        title: 'Create Form',
        view: <EditableEnvironmentChecker><CreateFormChoice/></EditableEnvironmentChecker>
    })),
    '/builder': withEnvContext(route({
        title: 'Create form with builder',
        view: <EditableEnvironmentChecker><CreateFormPage/></EditableEnvironmentChecker>
    })),
    '/file-upload': withEnvContext(route((req) => ({
        title: 'Create form via file upload',
        view: <EditableEnvironmentChecker><CreateFormFileUpload formContent={req.body}/></EditableEnvironmentChecker>
    })))
});


