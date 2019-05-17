import {lazy, mount, route} from 'navi'
import Home from "../pages/home/component/Home";
import React, {Suspense, useState} from "react";
import {Main} from "./Main";
import {Router, View} from "react-navi";
import {useKeycloak} from 'react-keycloak';
import {Loader} from "semantic-ui-react";
import secureLS from '../core/storage';
import {useTranslation} from "react-i18next";
import config from "react-global-configuration"
import _ from 'lodash';


const routes = mount({
    '/': route({
        title: 'Home',
        view: <Home/>
    }),
    '/forms': lazy(() => import('../pages/forms/formsRoute')),
});
export const ApplicationContext = React.createContext([{}, () => {
}]);

export const AppRouter = () => {
    const [keycloak, initialised] = useKeycloak();
    const {t} = useTranslation();

    const environments = config.get('environments');

    const environmentLocalStorage = secureLS.get('ENVIRONMENT');

    const [state, setState] = useState({
        environment: environmentLocalStorage ? _.find(environments, {id: environmentLocalStorage}) : null,
        activeMenuItem:  environmentLocalStorage ? t('menu.forms.name') : t('menu.home.name')
    });

    if (!initialised) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('loading')}</Loader></div>;
    }
    return (<ApplicationContext.Provider value={{state, setState}}>
            <Router routes={routes} context={{isAuthenticated: keycloak.authenticated, environment: state.environment}}>
                <Main>
                    <Suspense fallback={null}>
                        <View/>
                    </Suspense>
                </Main>
            </Router>
        </ApplicationContext.Provider>
    );
};



