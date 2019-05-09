import React from 'react';
import {lazy, map, mount, route, redirect} from 'navi'
import FormList from "./list/components/FormList";

const withEnvContext = (matcher) => {
    return map((request, context) =>
        context.environment
            ? matcher
            : redirect(
            '/')
    );
};

export default mount({
    '/:env': withEnvContext(route({
        "title": "Forms",
        "view": <FormList/>
    })),
    '/:env/create': withEnvContext(lazy(() => import('../forms/create/createFormRoutes'))),
    '/:env/:formId/preview': withEnvContext(lazy(() => import('../forms/preview/previewFormRoutes')))
});
