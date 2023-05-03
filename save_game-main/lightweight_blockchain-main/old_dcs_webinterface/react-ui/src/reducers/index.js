import { combineReducers } from 'redux';
import verify from './verify';
import modal from './modal';
import user from './user';
import payloads from './payloads';
import auth from './auth';

export default combineReducers({
    verify,
    modal,
    user,
    payloads,
    auth,
});
