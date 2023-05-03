import {
    SET_USER,
    GET_ALL_USERS,
    ADD_USER,
    LOGOUT_USER,
    DELETE_USER,
} from '../constants';

export default function (state = { user: {}, users: [] }, action) {
    switch (action.type) {
        case SET_USER:
            return { user: action.payload, users: state.users };
        case LOGOUT_USER:
            return { user: {}, users: state.users };
        case GET_ALL_USERS:
            return { user: state.user, users: action.payload };
        case ADD_USER:
            return { user: state.user, users: [...state, action.payload] };
        case DELETE_USER:
            return { user: state.user, users: state.users.filter((user) => user.user_id !== action.payload) };
        default: return state;
    }
}
