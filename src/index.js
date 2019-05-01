import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import * as serviceWorker from './serviceWorker';
import {Formio} from 'react-formio';
import {Router, View} from 'react-navi'
import routes from './core/routes';
import {App} from './App';
import configureStore from '../src/core/store'

const store = configureStore();

Formio.setProjectUrl("http://formio.lodev.xyz");
Formio.setBaseUrl("http://formio.lodev.xyz");


ReactDOM.render(
    <Provider store={store}>
        <Router routes={routes}>
            <App>
                <Suspense fallback={null}>
                    <View/>
                </Suspense>
            </App>
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
