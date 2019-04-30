import {createBrowserHistory} from 'history'
import {applyMiddleware, compose, createStore} from 'redux'
import {routerMiddleware} from 'connected-react-router'
import createRootReducer from './rootReducer';

export const history = createBrowserHistory();

const configureStore = (preloadedState) => {
    return createStore(
        createRootReducer(history),
        preloadedState,
        compose(
            applyMiddleware(
                routerMiddleware(history),
            ),
        ),
    )
};

export default configureStore;
