import { csrfFetch } from './csrf';

const POPULATE_SPOTS = "spots/POPULATE_SPOTS";

const ADD_SPOTS = "spots/ADD_SPOTS";

const DETAIL_SPOT = "spots/Detail_SPOT";

const POPULATE_USER_SPOTS = 'spots/POPULATE_USER_SPOTS';

const populateSpots = (spots) => {
  return {
    type: POPULATE_SPOTS,
    payload: spots
  }
}

const populateUserSpots = (spots) => {
  return {
    type: POPULATE_USER_SPOTS,
    payload: spots
  }
}

const addSpots = (spots) => {
  return {
    type: ADD_SPOTS,
    payload: spots
  }
}

const detailSpot = (spot) => {
  return {
    type: DETAIL_SPOT,
    payload: spot
  }
}

export const loadSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots?page=1&size=10');
  const data = await response.json();
  dispatch(populateSpots(data));
  return response;
}

export const loadUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  const data = await response.json();
  dispatch(populateUserSpots(data));
  return response;
}

export const nextPageSpots = (pageNum) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots?page=${pageNum}&size=10`);
  const data = await response.json();
  dispatch(addSpots(data));
  return response
}

export const showDetailSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const data = await response.json();
  dispatch(detailSpot(data));
  return response;
}

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: "POST",
    body: JSON.stringify(spot)
  });
  const data = await response.json();
  if (response.ok) return data;
  return response;
}

export const addSpotImage = (spotImage, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: spotImage
  });
  return response;
}

export const editSpot = (spot, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(spot)
  });
  return response;
}

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE"
  });
  return response;
}

const spotsReducer = ( state = {}, action) => {
  let newState;
  switch (action.type) {
    case POPULATE_SPOTS: {
      newState = {...state};
      newState = action.payload;
      return newState;
    }
    case POPULATE_USER_SPOTS: {
      newState = {...state};
      newState.UserSpots = action.payload;
      return newState;
    }
    case ADD_SPOTS: {
      newState = {...state};
      newState.Spots = [...newState.Spots, ...action.payload.Spots];
      newState.page = action.payload.page;
      return newState
    }
    case DETAIL_SPOT: {
      newState = {...state};
      newState.detailSpot = action.payload;
      return newState;
    }
    default:
      return state;
  };
};

export default spotsReducer;
