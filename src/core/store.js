import {createBrowserHistory} from 'history'
import {applyMiddleware, compose, createStore} from 'redux'
import {routerMiddleware} from 'connected-react-router'
import createRootReducer from './rootReducer';
import thunk from 'redux-thunk'
export const history = createBrowserHistory();


const configureStore = (preloadedState) => {
    return createStore(
        createRootReducer(history),
        preloadedState,
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunk
            ),
        ),
    )
};

export default configureStore;
