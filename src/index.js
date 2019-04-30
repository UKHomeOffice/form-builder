import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux'
import * as serviceWorker from './serviceWorker';
import configureStore, {history} from '../src/core/store'
import { ConnectedRouter } from 'connected-react-router'
import { Formio} from 'react-formio';
const store = configureStore();

Formio.setProjectUrl("http://formio.lodev.xyz");
Formio.setBaseUrl("http://formio.lodev.xyz");


ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <>
                <App/>
            </>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
