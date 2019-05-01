import {lazy, mount, route} from 'navi'
import Home from "../pages/home/component/Home";
import React from "react";


const routes = mount({
    '/' : route({
        title: 'Home',
        view: <Home/>
    }),
    '/forms': lazy(() => import('../pages/forms/list/Forms'))
});

export default routes;

