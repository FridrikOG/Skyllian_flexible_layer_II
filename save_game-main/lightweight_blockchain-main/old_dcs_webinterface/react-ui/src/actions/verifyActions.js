import {
    SET_VERIFY,
} from '../constants';

const setVerify = (isVerified) => ({
    type: SET_VERIFY,
    payload: isVerified,
});
export default setVerify;
