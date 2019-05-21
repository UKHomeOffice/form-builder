import React from 'react';
import {lazy, map, mount, route, redirect} from 'navi'
import FormList from "./list/components/FormList";

export const withEnvContext = (matcher) => {
    return map((request, context) =>
        context.environment
            ? matcher
            : redirect(
            '/')
    );
};

export default mount({
    '/:env': withEnvContext(route(req => {
        return {
            "title": "Forms",
            "view": <FormList env={req.params.env}/>
        };
    })),
    '/:env/create': lazy(() => import('../forms/create/createFormRoutes')),
    '/:env/:formId/edit': lazy(() => import('../forms/edit/editFormRoutes')),
    '/:env/:formId/preview': lazy(() => import('../forms/preview/previewFormRoutes'))
});
