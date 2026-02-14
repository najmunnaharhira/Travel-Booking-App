import { BOOKING, DELETE, SET_BOOKINGS, LOGIN, LOGOUT } from "./actionTypes";

export const makeBooking = (data) => ({
  type: BOOKING,
  payload: data,
});

export const deleteBooking = (id) => ({
  type: DELETE,
  payload: id,
});

export const setBookings = (bookings) => ({
  type: SET_BOOKINGS,
  payload: bookings,
});

export const login = (user) => ({ type: LOGIN, payload: user });
export const logout = () => ({ type: LOGOUT });
