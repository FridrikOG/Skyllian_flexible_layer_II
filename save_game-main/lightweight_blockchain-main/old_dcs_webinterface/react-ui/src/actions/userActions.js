import {
    SET_USER,
    GET_ALL_USERS,
    ADD_USER,
    LOGOUT_USER,
    DELETE_USER,
} from '../constants';
import userServices from '../services/userServices';

const setUserSuccess = (user) => ({
    type: SET_USER,
    payload: user,
});
const getAllUsersSuccess = (users) => ({
    type: GET_ALL_USERS,
    payload: users,
});
const addUserSuccess = (user) => ({
    type: ADD_USER,
    payload: user,
});
const logoutUserSuccess = () => ({
    type: LOGOUT_USER,
});
const deleteUserSuccess = (id) => ({
    type: DELETE_USER,
    payload: id,
});

export const deleteUser = (id) => async (dispatch) => {
    try {
        // console.log('Getting all users')
        await userServices.deleteUser(id);
        // console.log(users)
        dispatch(deleteUserSuccess(id));
    } catch (err) {
        // TODO: Handle error
    }
};

export const getAllUsers = () => async (dispatch) => {
    try {
        // console.log('Getting all users')
        const users = await userServices.getAllUsers();
        // console.log(users)
        dispatch(getAllUsersSuccess(users));
    } catch (err) {
        // TODO: Handle error
    }
};

export const setUser = (user) => async (dispatch) => {
    // try {
    const userO = await userServices.setUser(user);
    // console.log(userO)
    dispatch(setUserSuccess(userO));
    // } catch (err) {
    //     // TODO: Handle error
    //     console.log('Error ' + err);
    // }
};

export const setUserById = (id) => async (dispatch) => {
    try {
        const userO = await userServices.setUserById(id);
        dispatch(setUserSuccess(userO));
    } catch (err) {
        // TODO: Handle error
        console.log(`Error ${err}`);
    }
};

export const addUser = (user) => async (dispatch) => {
    try {
        const userO = await userServices.addUser(user);
        dispatch(addUserSuccess(userO));
    } catch (err) {
        // TODO: Handle error
    }
};

export const logoutUser = () => async (dispatch) => {
    try {
        dispatch(logoutUserSuccess());
    } catch (err) {
        // TODO: Handle error
    }
};
