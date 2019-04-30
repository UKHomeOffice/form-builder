import React from 'react';
import { Route, Switch } from 'react-router'
import PageNotFound from "../pages/PageNotFound";
import Home from "../pages/home/component/Home";
import FormListContainer from "../pages/forms/list/containers/FormListContainer";

const Main = () => (
    <main>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/forms" component={FormListContainer}/>
            <Route component={PageNotFound}/>
        </Switch>
    </main>
);

export default Main;
