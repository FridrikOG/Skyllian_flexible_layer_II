import {
    GET_AUTH_LEVEL,
    DELETE_AUTH_LEVEL,
} from '../constants';

export default function (state = { auth: 'auth' }, action) {
    switch (action.type) {
        case GET_AUTH_LEVEL:
            return action.payload;
        case DELETE_AUTH_LEVEL:
            return { auth: 'auth' };
        default: return state;
    }
}
