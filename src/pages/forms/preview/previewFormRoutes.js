import {mount, route} from 'navi'
import React from "react";
import PreviewFormPage from "./semantic/components/PreviewFormPage";
import {withEnvContext} from "../formsRoute";
import GovUKPreviewFormPage from "./govUK/components/GovUKPreviewFormPage";

export default mount({
    '/': withEnvContext(route(req => {
        return {
            title: 'Preview Form',
            view: <PreviewFormPage formId={req.params.formId}/>
        }
    })),
    '/gov-uk': withEnvContext(route(req => {
        return {
            title: 'Preview Form',
            view: <GovUKPreviewFormPage formId={req.params.formId}/>
        }
    })),

});


