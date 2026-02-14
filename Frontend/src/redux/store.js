import { createStore, combineReducers } from "redux";
import bookingReducer from "./bookingReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  booking: bookingReducer,
  auth: authReducer,
});

const store = createStore(rootReducer);
export default store;
