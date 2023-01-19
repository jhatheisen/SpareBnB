import { csrfFetch } from "./csrf";

const POPULATE_BOOKINGS = 'spots/POPULATE_BOOKINGS';

const populateBookings = (bookings) => {
  return {
    type: POPULATE_BOOKINGS,
    payload: bookings
  }
}

export const loadUserBookings = () => async (dispatch) => {
  const response = await csrfFetch('/api/bookings/current');
  const data = await response.json();
  dispatch(populateBookings(data));
  return response;
}

export const createBooking = (booking, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
    method: "POST",
    body: JSON.stringify(booking)
  });
  return response;
}

export const deleteBooking = (bookingId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: 'DELETE'
  });
  return response;
}

const bookingsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case POPULATE_BOOKINGS: {
      newState = {...state};
      newState = action.payload;
      return newState;
    }
    default:
      return state;
  };
};

export default bookingsReducer;
