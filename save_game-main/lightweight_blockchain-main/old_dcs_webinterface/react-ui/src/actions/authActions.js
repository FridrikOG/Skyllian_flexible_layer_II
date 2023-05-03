import {
    GET_AUTH_LEVEL,
    DELETE_AUTH_LEVEL,
} from '../constants';
import authServices from '../services/authServices';

const getAuthLevelSuccess = (authLevel) => ({
    type: GET_AUTH_LEVEL,
    payload: authLevel,
});

const deleteAuthLevelSuccess = () => ({
    type: DELETE_AUTH_LEVEL,
});

export const deleteAuthLevel = () => async (dispatch) => {
    try {
        await authServices.deleteAuthLevel();
        dispatch(deleteAuthLevelSuccess());
    } catch (err) {
        // TODO: Handle error
        console.log(err);
    }
};

export const getAuthLevel = () => async (dispatch) => {
    try {
        const authLevel = await authServices.getAuthLevel();
        dispatch(getAuthLevelSuccess(authLevel));
    } catch (err) {
        // TODO: Handle error
        console.log(err);
    }
};
