import React from 'react';
import {lazy, mount, route} from 'navi'
import FormList from "./list/components/FormList";


export default mount({
    '/:env': route({
        "title": "Forms",

        "view": <FormList/>
    }),
    '/:env/create': lazy(() => import('../forms/create/createFormRoutes')),
    '/:env/:formId/preview': lazy(() => import('../forms/preview/previewFormRoutes'))
});
