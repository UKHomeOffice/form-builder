import {mount, route} from 'navi'
import Home from "../pages/home/component/Home";
import React from "react";


const routes = mount({
    '/' : route({
        title: 'Home',
        view: <Home/>
    }),
    '/hello': route({
        title: 'Home2',
        view: <Home/>
    })
});

export default routes;

