import {mount, route} from 'navi'
import React from "react";
import PreviewForm from "./components/PreviewForm";


export default mount({
    '/': route(req => {
        return {
            title: 'Preview Form',
            view: <PreviewForm formId={req.params.formId}/>
        }
    })
});


