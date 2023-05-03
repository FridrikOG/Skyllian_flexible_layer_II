import { createStore, combineReducers } from "redux";

import userReducer from "./reducers/userReducer";

const allReducers = combineReducers({
  userReducer,
});

export default createStore(
  allReducers
  // eslint-disable-next-line no-underscore-dangle
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
