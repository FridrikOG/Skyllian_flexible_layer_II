import payloadService from '../services/payloadService';
import {
    SET_ALL_PAYLOADS,
    ADD_PAYLOAD,
} from '../constants';

const getAllPayloadsSuccess = (payloads) => ({
    type: SET_ALL_PAYLOADS,
    payload: payloads,
});

const addPayloadSuccess = (payloads) => ({
    type: ADD_PAYLOAD,
    payload: payloads,
});

export const addPayload = (payload) => async (dispatch) => {
    try {
        const payloadO = await payloadService.addPayload(payload);
        dispatch(addPayloadSuccess(payloadO));
    } catch (err) {
        // TODO: Handle error
    }
};

export const getPayloads = (id) => async (dispatch) => {
    try {
        const payloadO = {
            id,
        };
        const payloads = await payloadService.getAllPayloads(payloadO);
        dispatch(getAllPayloadsSuccess(payloads));
    } catch (err) {
        // TODO: Handle error
    }
};
