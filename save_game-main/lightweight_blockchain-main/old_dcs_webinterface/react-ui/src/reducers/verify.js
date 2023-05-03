// import update from 'immutability-helper';
import {
  SET_VERIFY,
} from '../constants';

export default function (state = false, action) {
  switch (action.type) {
    case SET_VERIFY: return action.payload;
    default: return state;
  }
}
