import { BOOKING, DELETE, SET_BOOKINGS } from "./actionTypes";

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
