import React from 'react';
import {lazy, mount, route} from 'navi'
import FormList from "./list/components/FormList";
import {withAccessAuthorization, withEnvContext} from "../../core/AppRouter";


export default mount({
    '/:env': withAccessAuthorization(withEnvContext(route({
        "title": "Forms",
        "view": <FormList/>
    }))),
    '/:env/create': lazy(() => import('../forms/create/createFormRoutes')),
    '/:env/:formId/edit': lazy(() => import('../forms/edit/editFormRoutes')),
    '/:env/:formId/schema': lazy(() => import('../forms/jsoneditor/formSchemaEditorRoutes')),
    '/:env/:formId/preview': lazy(() => import('../forms/preview/previewFormRoutes')),
    '/:env/:formId/promote': lazy(() => import('../forms/promote/formPromotionRoutes'))

});
