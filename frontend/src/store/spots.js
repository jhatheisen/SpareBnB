import { csrfFetch } from './csrf';

const POPULATE_SPOTS = "spots/POPULATE_SPOTS";

const populateSpots = (spots) => {
  return {
    type: POPULATE_SPOTS,
    payload: spots
  }
}

export const loadSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();
  dispatch(populateSpots(data));
  return response;
}

const spotsReducer = ( state = {}, action) => {
  let newState;
  switch (action.type) {
    case POPULATE_SPOTS: {
      newState = Object.assign({}, state);
      newState = action.payload;
      return newState;
    }
    default:
      return state;
  };
};

export default spotsReducer;
