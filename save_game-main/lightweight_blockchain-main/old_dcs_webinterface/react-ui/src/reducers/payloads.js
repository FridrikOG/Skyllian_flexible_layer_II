import {
    SET_ALL_PAYLOADS,
    ADD_PAYLOAD,
} from '../constants';

export default function (state = [], action) {
    switch (action.type) {
        case SET_ALL_PAYLOADS: return action.payload;
        case ADD_PAYLOAD: return [
            ...state,
            action.payload,
        ];
        default: return state;
    }
}
