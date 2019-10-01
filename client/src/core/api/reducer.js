import { EXECUTING, SUCCESS, ERROR } from './actionTypes';

export const initialState = {
    status: null,
    response: null,
    exception: null,
};

const reducer = (state = initialState, { type, response, exception } = {}) => {
    switch (type) {
        case EXECUTING:
            return { ...initialState, status: EXECUTING };
        case SUCCESS:
            return { ...state, status: SUCCESS, response };
        case ERROR:
            return {
                ...state,
                status: ERROR,
                response,
                exception,
            };
        default:
            return state;
    }
};

export default reducer;
