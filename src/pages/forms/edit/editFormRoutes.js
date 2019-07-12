import {mount, route} from 'navi'
import React from "react";
import EditFormPage from "./components/EditFormPage";
import {withEditAuthorization, withEnvContext} from "../../../core/AppRouter";


export default mount({
    '/': withEditAuthorization(withEnvContext(route(req => {
        return {
            title: 'Edit Form',
            view: <EditFormPage formId={req.params.formId}/>
        }
    })))
});
