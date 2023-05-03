import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import bossReducer from "./reducers/bubbleReducer";
import bundleReducer from "./reducers/bundleReducer";
import purchasesReducer from "./reducers/purchasesReducer";
import userReducer from "./reducers/userReducers";

const allReducers = combineReducers({
  userReducer,
  bossReducer,
});

export default createStore(
  allReducers,
  applyMiddleware(thunk)
  // // eslint-disable-next-line no-underscore-dangle
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
