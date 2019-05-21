import {mount, route} from 'navi'
import React from "react";
import {withEnvContext} from "../formsRoute";
import FormPromotionPage from "./components/FormPromotionPage";


export default mount({
    '/': withEnvContext(route(req => {
        return {
            title: 'Promote Form',
            view: <FormPromotionPage formId={req.params.formId}/>
        }
    }))
});


