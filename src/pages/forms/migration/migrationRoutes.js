import {mount, route} from 'navi'
import React from "react";
import {withEditAuthorization} from "../../../core/AppRouter";
import MigrationPage from "./components/MigrationPage";


export default mount({
    '/': withEditAuthorization(route(req => {
        return {
            title: 'Migration',
            view: <MigrationPage/>
        }
    })),
});
