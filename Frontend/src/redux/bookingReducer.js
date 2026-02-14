/* eslint-disable no-case-declarations */
import { BOOKING, DELETE, SET_BOOKINGS } from "./actionTypes";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOOKINGS:
      return { ...state, data: action.payload, error: null };
    case BOOKING:
      const newData = [...state.data];
      newData.push(action.payload);
      return { data: newData };
    case DELETE:
      const filteredData = state.data.filter((d) => String(d.id) !== String(action.payload));
      return { data: filteredData };
    default:
      return state;
  }
};

export default bookingReducer;
