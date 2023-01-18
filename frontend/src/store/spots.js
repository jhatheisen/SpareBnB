import { csrfFetch } from './csrf';

const POPULATE_SPOTS = "spots/POPULATE_SPOTS";

const ADD_SPOTS = "spots/ADD_SPOTS";

const populateSpots = (spots) => {
  return {
    type: POPULATE_SPOTS,
    payload: spots
  }
}

const addSpots = (spots) => {
  return {
    type: ADD_SPOTS,
    payload: spots
  }
}

export const loadSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots?page=1&size=5');
  const data = await response.json();
  dispatch(populateSpots(data));
  return response;
}

export const nextPageSpots = (pageNum) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots?page=${pageNum}&size=5`);
  const data = await response.json();
  dispatch(addSpots(data));
  return response
}

const spotsReducer = ( state = {}, action) => {
  let newState;
  switch (action.type) {
    case POPULATE_SPOTS: {
      newState = {...state}
      newState = action.payload;
      return newState;
    }
    case ADD_SPOTS: {
      newState = {...state}
      newState.Spots = [...newState.Spots, ...action.payload.Spots];
      newState.page = action.payload.page;
      return newState
    }
    default:
      return state;
  };
};

export default spotsReducer;
