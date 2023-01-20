import { csrfFetch } from "./csrf";

const POPULATE_REVIEWS = 'reviews/POPULATE_REVIEWS';

const ADD_REVIEW = 'reviews/ADD_REVIEW';

const populateReviews = (reviews) => {
  return {
    type: POPULATE_REVIEWS,
    payload: reviews
  }
}

const addReview = (review) => {
  return {
    type: ADD_REVIEW,
    payload: review
  }
}

export const loadSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await response.json();
  dispatch(populateReviews(data));
  return response;
}

export const createNewReview = (review, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review)
  });
  const data = await response.json();
  if (response.ok) return data;
  // console.log(data);
  // dispatch(addReview(data));
  return response;
}

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  })
  return response;
}

export const addReviewImage = (reviewImage, reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
    method: "POST",
    body: JSON.stringify(reviewImage)
  })
  return response;
}

const reviewsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case POPULATE_REVIEWS: {
      newState = {...state};
      newState = action.payload;
      return newState;
    }
    // case ADD_REVIEW: {
    //   newState = {...state}
    //   newState.Reviews = [...newState.Reviews, action.payload];
    //   return newState;
    // }
    default:
      return state;
  }
}

export default reviewsReducer;
