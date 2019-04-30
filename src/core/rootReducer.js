import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import { forms } from 'react-formio';

export default (history) => combineReducers({
    router: connectRouter(history),
    forms: forms({ name: 'forms', query: {type: 'form', tags: 'common'}}),

});
