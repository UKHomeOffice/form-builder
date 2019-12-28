import React from 'react';
import {lazy, mount, route} from 'navi'
import FormList from "./list/components/FormList";
import {withAccessAuthorization, withEnvContext} from "../../core/AppRouter";
import config from 'react-global-configuration';
import _ from "lodash";

const environment = (id) => {
    const environment = _.find(config.get('environments'), {id: id});
    return environment ? environment.label : id;
}

export default mount({
    '/:env': withAccessAuthorization(withEnvContext(route(req => {
        return {
            "title": `Forms in ${environment(req.params.env)}`,
            "view": <FormList/>
        }
    }))),
    '/:env/create': lazy(() => import('../forms/create/createFormRoutes')),
    '/:env/:formId/edit': lazy(() => import('../forms/edit/editFormRoutes')),
    '/:env/:formId/preview': lazy(() => import('../forms/preview/previewFormRoutes')),
    '/:env/:formId/promote': lazy(() => import('../forms/promote/formPromotionRoutes'))

});
