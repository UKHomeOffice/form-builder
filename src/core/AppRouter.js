import {lazy, mount, route} from 'navi'
import Home from "../pages/home/component/Home";
import React, {Suspense, useState} from "react";
import {ApplicationContext, Main} from "./Main";
import {Router, View} from "react-navi";
import {useKeycloak} from 'react-keycloak';
import {Loader} from "semantic-ui-react";

const routes = mount({
    '/': route({
        title: 'Home',
        view: <Home/>
    }),
    '/forms': lazy(() => import('../pages/forms/formsRoute')),
});

export const AppRouter = () => {
    const [keycloak, initialised] = useKeycloak();
    const [state, setState] = useState({});

    if (!initialised) {
        return <div className="center"><Loader active inline='centered' size='large'>Loading</Loader></div>;
    }

    return (<ApplicationContext.Provider value={{state, setState}}>
            <Router routes={routes} context={{isAuthenticated: keycloak.authenticated}}>
                <Main>
                    <Suspense fallback={null}>
                        <View/>
                    </Suspense>
                </Main>
            </Router>
        </ApplicationContext.Provider>
    );
};



