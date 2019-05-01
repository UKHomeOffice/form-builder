import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'

export const history = createBrowserHistory();


const configureStore = (preloadedState) => {
    return createStore(
        () => {},
        preloadedState,
        compose(
            applyMiddleware(
                thunk
            ),
        ),
    )
};

export default configureStore;
