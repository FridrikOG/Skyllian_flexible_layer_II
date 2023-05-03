import {
    SET_LOGIN_MODAL,
    SET_VERIFY_MODAL,
} from '../constants';

export default function (state = { showLoginModal: false, showVerifyModal: false }, action) {
    switch (action.type) {
        case SET_LOGIN_MODAL: return {
            showLoginModal: action.payload,
            showVerifyModal: state.showVerifyModal,
        };
        case SET_VERIFY_MODAL: return {
            showLoginModal: state.showLoginModal,
            showVerifyModal: action.payload,
        };
        default: return state;
    }
}
