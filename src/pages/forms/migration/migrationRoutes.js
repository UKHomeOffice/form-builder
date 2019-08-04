import {mount, route} from 'navi'
import React from "react";
import {withPromotionAuthorization} from "../../../core/AppRouter";
import MigrationPage from "./components/MigrationPage";


export default mount({
    '/': withPromotionAuthorization(route(req => {
        return {
            title: 'Migration',
            view: <MigrationPage/>
        }
    })),
});
