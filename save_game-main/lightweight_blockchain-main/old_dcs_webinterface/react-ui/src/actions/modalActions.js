import {
    SET_LOGIN_MODAL,
    SET_VERIFY_MODAL,
} from '../constants';

export const setLoginModal = (showLoginModal) => ({
    type: SET_LOGIN_MODAL,
    payload: showLoginModal,
});

export const setVerifyModal = (showVerifyModal) => ({
    type: SET_VERIFY_MODAL,
    payload: showVerifyModal,
});
