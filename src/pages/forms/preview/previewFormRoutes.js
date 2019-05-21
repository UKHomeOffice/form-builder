import {mount, route} from 'navi'
import React from "react";
import PreviewFormPage from "./components/PreviewFormPage";
import {withEnvContext} from "../formsRoute";


export default mount({
    '/': withEnvContext(route(req => {
        return {
            title: 'Preview Form',
            view: <PreviewFormPage formId={req.params.formId}/>
        }
    }))
});


