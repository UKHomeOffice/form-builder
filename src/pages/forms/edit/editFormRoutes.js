import {mount, route} from 'navi'
import React from "react";
import EditFormPage from "./components/EditFormPage";
import {withEditAuthorization, withEnvContext} from "../../../core/AppRouter";
import FormSchemaEditor from "./components/FormSchemaEditor";


export default mount({
    '/': withEditAuthorization(withEnvContext(route(req => {
        return {
            title: 'Edit Form',
            view: <EditFormPage formId={req.params.formId}/>
        }
    }))),
    '/schema': withEditAuthorization(withEnvContext(route(req => {
        return {
            title: 'Edit Schema',
            view: <FormSchemaEditor formId={req.params.formId}/>
        }
    })))
});
