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
