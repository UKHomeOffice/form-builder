import {mount, route} from 'navi'
import React from "react";
import EditFormPage from "./components/EditFormPage";


export default mount({
    '/': route(req => {
        return {
            title: 'Edit Form',
            view: <EditFormPage formId={req.params.formId}/>
        }
    })
});
