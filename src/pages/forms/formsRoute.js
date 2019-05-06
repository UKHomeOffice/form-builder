import React from 'react';
import {lazy, mount, route} from 'navi'
import FormList from "./list/components/FormList";

export default mount({
    '/': route({
        "title" : "Forms",
        "view": <FormList/>
    }),
    '/create': lazy(() => import('../forms/create/createFormRoutes')),
    '/:formId/preview':lazy(() => import('../forms/preview/previewFormRoutes'))
})
