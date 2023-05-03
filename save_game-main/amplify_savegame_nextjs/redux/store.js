import { createStore, combineReducers } from "redux";

import userReducer from "./reducers/userReducer";
import userStatReducer from "./reducers/userStatReducer";
import characterReducer from "./reducers/characterReducer";

const allReducers = combineReducers({
  userReducer,
  userStatReducer,
  characterReducer,
});

export default createStore(
  allReducers
  // eslint-disable-next-line no-underscore-dangle
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
