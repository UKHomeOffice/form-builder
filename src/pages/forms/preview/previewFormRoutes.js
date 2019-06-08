import {mount, route} from 'navi'
import React from "react";
import PreviewFormPage from "./semantic/components/PreviewFormPage";
import GovUKPreviewFormPage from "./govUK/components/GovUKPreviewFormPage";
import {withEnvContext} from "../../../core/AppRouter";

export default mount({
    '/': withEnvContext(route(req => {
        return {
            title: 'Preview Form',
            view: <PreviewFormPage formId={req.params.formId}/>
        }
    })),
    '/gov-uk': withEnvContext(route(req => {
        return {
            title: 'Preview Form GDS',
            view: <GovUKPreviewFormPage formId={req.params.formId}/>
        }
    })),

});


