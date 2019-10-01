import {mount, route} from 'navi'
import React from "react";
import FormPromotionPage from "./components/FormPromotionPage";
import {withEnvContext, withPromotionAuthorization} from "../../../core/AppRouter";


export default mount({
    '/': withPromotionAuthorization(withEnvContext(route(req => {
        return {
            title: 'Promote Form',
            view: <FormPromotionPage formId={req.params.formId}/>
        }
    })))
});


