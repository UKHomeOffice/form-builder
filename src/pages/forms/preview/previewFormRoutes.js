import {mount, route} from 'navi'
import React from "react";
import PreviewFormPage from "./components/PreviewFormPage";


export default mount({
    '/': route(req => {
        return {
            title: 'Preview Form',
            view: <PreviewFormPage formId={req.params.formId}/>
        }
    })
});


