import { EXECUTING, SUCCESS, ERROR } from './actionTypes';

export const executing = () => ({ type: EXECUTING });
export const success = response => ({ type: SUCCESS, response });
export const error = (response, exception) => ({
    type: ERROR,
    response,
    exception,
});
