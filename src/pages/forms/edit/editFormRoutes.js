import {mount, route} from 'navi'
import React from "react";
import EditFormPage from "./components/EditFormPage";
import {withEnvContext} from "../formsRoute";


export default mount({
    '/': withEnvContext(route(req => {
        return {
            title: 'Edit Form',
            view: <EditFormPage formId={req.params.formId}/>
        }
    }))
});
