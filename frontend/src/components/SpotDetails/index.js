import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { showDetailSpot } from "../../store/spots";
import './SpotDetails.css';
import MapContainer from '../Maps/index';
import * as spotsActions from '../../store/spots';
import * as bookingActions from '../../store/bookings';
import * as reviewActions from '../../store/reviews';

function SpotDetails() {

  useEffect(() => {
    dispatch(showDetailSpot(spotId));
    dispatch(reviewActions.loadSpotReviews(spotId));
    dispatch(bookingActions.loadUserBookings());
  }, []);

  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const detailedSpot = useSelector(state => state.spots.detailSpot);
  const user = useSelector(state => state.session.user);
  const reviews = useSelector(state => state.reviews.Reviews);
  const bookings = useSelector(state => state.bookings.Bookings);

  const [review, setReview] = useState('');
  const [stars, setStars] = useState(1);
  const [reviewImageURL, setReviewImageURL] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currDate, setCurrDate] = useState(new Date());
  const [errors, setErrors] = useState([]);
  const [reviewErrors, setReviewErrors] = useState([]);

  let ownedSpot = null;
  let pastbooking = false;
  let alreadyReviewed = false;

  if (!detailedSpot) return null;

  if (user) ownedSpot = detailedSpot.ownerId == user.id;
  if (bookings) {
    bookings.forEach(booking => {
      const sameSpot = booking.spotId == spotId;
      // console.log('same spot?: ',sameSpot);
      const bookingEndDate = new Date(booking.endDate);
      bookingEndDate.setDate(bookingEndDate.getDate() + 1);
      // console.log('past booking?: ', bookingEndDate <= currDate);
      // console.log('pastbooking?: ', sameSpot && bookingEndDate <= currDate);
      if (sameSpot && bookingEndDate <= currDate) pastbooking = true;
    })
  }

  if (reviews) {
    reviews.forEach(review => {
      const reviewOwner = review.userId;
      if (reviewOwner == user.id) alreadyReviewed = true;
    })
  }


  const {
    name,
    avgStarRating,
    numReviews,
    city,
    state,
    country,
    SpotImages,
    Owner,
    description,
    price,
    lat,
    lng,
    address
  } = detailedSpot;

  const handleEdit = () => {
    history.push(`/spots/edit/${spotId}`);
  }

  const handleBook = async (e) => {
    e.preventDefault();
    setErrors([]);

    const newBooking = {
      startDate,
      endDate
    }

    try {
      const createBookingResponse = await dispatch(bookingActions.createBooking(newBooking, spotId));
      if (await createBookingResponse.ok) {
        window.alert('Booking Created');
        history.push('/user/bookings');
      }
    } catch (e) {
      const data = await e.json()
      if (data && data.errors) setErrors(data.errors)
    }

  }

  const handleDelete = () => {
    const deleting = window.confirm("Are you sure you want to delete this spot?");
    if (deleting) {
      dispatch(spotsActions.deleteSpot(spotId));
      history.push('/');
    }
  }

  const handleCreateReview = async (e) => {
    setReviewErrors([]);

    const newReview = {
      review,
      stars
    }

    try {
      const createReviewResponse = await dispatch(reviewActions.createNewReview(newReview, spotId));
      if (await createReviewResponse.ok) {
        window.alert('Review Created');
        history.go(0);
      }
    } catch (e) {
      const data = await e.json()
      if (data && data.message) setReviewErrors([data.errors] || [data.message])
      console.log(data);
    }

  }

  const handleReviewDelete = async (reviewId) => {

    const deleting = window.confirm("Are you sure you want to delete this Review?");
    if (deleting) {
      dispatch(reviewActions.deleteReview(reviewId));
      history.go(0);
    }
  }


  return (
    <div className="outsideContainer">
      <div className="spotContainer">

        <h1 className="spotName">{name}</h1>
          {ownedSpot &&
            <button className="editButton" onClick={handleEdit}>Edit</button>
          }
          {ownedSpot &&
            <button className="deleteButton" onClick={handleDelete}>Delete</button>
          }
        <div className="titleBar">
          <p><i className="fa-solid fa-star"></i>{avgStarRating}</p>
          <span>&#183;</span>
          <p><u>{numReviews} reviews</u></p>
          <span>&#183;</span>
          <p><u>{city}, {state}, {country}</u></p>
          <span>&#183;</span>
          <p>{address}</p>
        </div>

        <div className="imageContainer">
          {detailedSpot &&
            SpotImages.map(image => {
              return (
                <img src={image.url} alt={name} className="previewImages"/>
                );
              })
          }
          {/* <button>Show more ...</button> */}
        </div>

        <div className="detailsContainer">
          <h2>Home hosted by {Owner.firstName} <i className="ownerProfile fa-xl fa-solid fa-circle-user" /></h2>
          <p>{description}</p>
        </div>

        <hr/>
        <MapContainer center={{lat, lng}}/>
        <hr/>

        <div className="reviewsContainer">



          <h2>Reviews</h2>
          <div className="reviewsInfo">
            <h2><i className="fa-solid fa-star"></i>{avgStarRating}</h2>
            <span>&#183;</span>
            <h2><u>{numReviews} reviews</u></h2>
          </div>

          { pastbooking && !alreadyReviewed &&
            <div>
              <h2>Post A Review</h2>
              <form onSubmit={handleCreateReview}>
                <label for='review'>
                  Review
                </label>
                <input
                  type="text"
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  // required
                />
                <label for='stars'>
                  <i className="fa-solid fa-star"></i>
                  {stars}
                </label>
                <input
                  type="range"
                  id="stars"
                  max={5}
                  step={1}
                  value={stars}
                  onChange={(e) => setStars(e.target.value)}
                  // required
                />
                <label for='reviewImage'>
                  Image URL
                </label>
                <input
                type='text'
                id="reviewImage"
                value={reviewImageURL}
                onChange={(e) => setReviewImageURL(e.target.value)}
                />
                <button type="submit">Post</button>
              </form>
              <ul className="createReviewErrors">
                    {reviewErrors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
            </div>
          }

          { reviews &&
              reviews.map(review => {

                const reviewImages = review.ReviewImages;
                const uploadDate = new Date(review.createdAt);
                uploadDate.setDate(uploadDate.getDate() + 1);
                const reviewId = review.userId;
                const userReview = reviewId == user.id;

                return (
                  <div>
                    <p><i className="fa-solid fa-user" /> {review.User.firstName}</p>
                    { userReview &&
                        <button onClick={() => handleReviewDelete(review.id)}>Delete</button>
                    }
                    <p>{uploadDate.toDateString()}</p>
                    <p>{review.review} <i className="fa-solid fa-star"></i>{review.stars}</p>
                    { reviewImages &&
                      reviewImages.map(image => (
                        <img src={image.url}/>
                      ))
                    }
                  </div>
                );
              }
              )
          }
        </div>


        <div className="bookingContainer">
          <h2>${price} <span className='notBold'>per night</span></h2>
          <div className="bookingDetails">
            <p><i className="fa-solid fa-star"></i>{avgStarRating}</p>
            <span>&#183;</span>
            <p><u>{numReviews} reviews</u></p>
          </div>
          {
            !ownedSpot &&
              (<div className="createBookingContainer">
                <form onSubmit={handleBook}>
                    <label for='startDate'>
                      Start Date
                    </label>
                    <input
                    type='date'
                    id='startDate'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    />
                    <label for='endDate'>
                      End Date
                    </label>
                    <input
                    type='date'
                    id='endDate'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    />
                    <button type="submit">BOOK</button>
                  </form>
                  <ul className="createBookingErrors">
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                  </ul>
              </div>)
          }
        </div>

      </div>
    </div>
  );
}

export default SpotDetails;
