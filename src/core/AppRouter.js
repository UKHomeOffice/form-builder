import {lazy, mount, route} from 'navi'
import Home from "../pages/home/component/Home";
import React, {Suspense} from "react";
import {Main} from "./Main";
import {Router, View} from "react-navi";
import {useKeycloak} from 'react-keycloak';
import {Loader} from "semantic-ui-react";


const routes = mount({
    '/': route({
        title: 'Home',
        view: <Home/>
    }),
    '/forms': lazy(() => import('../pages/forms/list/Forms')),
    '/forms/create': lazy(() => import('../pages/forms/create/CreateForm'))
});

export const AppRouter = () => {
    const [keycloak, initialised] = useKeycloak();
    const centerStyle = {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    if (!initialised) {
        return <div style={centerStyle}><Loader active inline='centered' size='large'>Loading</Loader></div>;
    }


    return (
        <Router routes={routes} context={{isAuthenticated: keycloak.authenticated}}>
            <Main>
                <Suspense fallback={null}>
                    <View/>
                </Suspense>
            </Main>
        </Router>
    );
};



