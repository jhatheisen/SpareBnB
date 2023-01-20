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
  const [stars, setStars] = useState(3);
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
      const bookingStartDate = new Date(booking.startDate);
      bookingStartDate.setDate(bookingStartDate.getDate() + 1);
      if (sameSpot && bookingStartDate <= currDate) pastbooking = true;
    })
  }

  if (reviews) {
    reviews.forEach(review => {
      const reviewOwner = review.userId;
      if (user) {
        if (reviewOwner == user.id) alreadyReviewed = true;
      }
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

    e.preventDefault();

    try {
      const createReviewResponse = await dispatch(reviewActions.createNewReview(newReview, spotId));

      window.alert('Review Created');

      const reviewId = createReviewResponse.id;

      if (reviewImageURL) {
        try {
          const createReviewImageResponse = await dispatch(reviewActions.addReviewImage({url: reviewImageURL}, reviewId));
          if (await createReviewImageResponse.ok) {
          }
        } catch (e) {
          const data = await e.json()
          if (data && data.message) setReviewErrors([data.errors] || [data.message])
          return;
        }
      }

    history.go(0);
    } catch (e) {
      console.log('caught');
      const data = await e.json()
      if (data && data.message) setReviewErrors([data.errors] || [data.message])
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
        <div className="titleContainer">
          <h1 className="spotName">{name}</h1>
            {ownedSpot &&
              <button className="editButton" onClick={handleEdit}>Edit</button>
            }
            {ownedSpot &&
              <button className="deleteButton" onClick={handleDelete}>Delete</button>
            }
        </div>
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

        {/* <div className="mapnbooking">
          <MapContainer center={{lat, lng}}/> */}

          <div className="bookingContainer">
          <h2>${price} <span className='notBold'>per night</span></h2>
          <div className="bookingDetails">
            <p><i className="fa-solid fa-star"></i>{avgStarRating}</p>
            <span>&#183;</span>
            <p><u>{numReviews} reviews</u></p>
          </div>
          {
            !ownedSpot && user &&
              (<div className="createBookingContainer">
                <form onSubmit={handleBook} className="bookingForm">
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
                    <button type="submit" id="bookButton">BOOK</button>
                  </form>
                  <ul className="createBookingErrors">
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                  </ul>
              </div>)
          }
          { !user &&
            <h2 className="noUserWarning">Please Log In To Book</h2>

          }
          { ownedSpot &&
            <h2 className="noUserWarning">Cannot Book At A Spot You Own</h2>

          }
        </div>
        {/* </div> */}
        <hr/>

        <div className="reviewsContainer">



          <h2>Reviews</h2>
          <div className="reviewsInfo">
            <h2><i className="fa-solid fa-star"></i>{avgStarRating}</h2>
            <span>&#183;</span>
            <h2><u>{numReviews} reviews</u></h2>
          </div>

          <h2>Post A Review</h2>
          <hr/>
          {ownedSpot &&
            <h3>Cannot Review Your Own Spot</h3>
          }
          {alreadyReviewed &&
            <h3>Can only have 1 active review.</h3>
          }
          {!pastbooking && !ownedSpot &&
            <h3>Must have booked this spot, and booking already started to review.</h3>
          }
          { user && !ownedSpot && !alreadyReviewed && pastbooking &&
            <div >
              <form onSubmit={handleCreateReview} className="reviewForm">
                <div className="reviewInput">
                  <label for='review'>
                    Review
                  </label>
                  <textarea
                    type="textarea"
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                  />
                </div>
                <div className="reviewInput">
                  <label for='stars'>
                    <i className="fa-solid fa-star"></i>
                    {stars}
                  </label>
                  <input
                    type="range"
                    id="stars"
                    max={5}
                    min={1}
                    step={1}
                    value={stars}
                    onChange={(e) => setStars(e.target.value)}
                    required
                  />
                </div>
                <div className="reviewInput">
                  <label for='imageURL'>
                    Image URL
                  </label>
                  <input
                  type='text'
                  id="imageURL"
                  value={reviewImageURL}
                  onChange={(e) => setReviewImageURL(e.target.value)}
                  />
                </div>
                <div className="reviewInput">
                  <button type="submit" id="basicButton" >Post</button>
                </div>
              </form>
              <ul className="createReviewErrors">
                    {reviewErrors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
            </div>
          }

          { !user &&
            (
              <h2 className='noUserWarning'>Please Log In To Review</h2>
            )
          }

          <hr/>

          { reviews &&
              reviews.map(review => {

                const reviewImages = review.ReviewImages;
                const uploadDate = new Date(review.createdAt);
                uploadDate.setDate(uploadDate.getDate() + 1);
                const reviewId = review.userId;
                let userReview = null;

                if (user) {
                  userReview = reviewId == user.id;
                }

                return (
                  <div>
                    <p><i className="fa-solid fa-circle-user fa-2xl" /><span id="reviewerName">{review.User.firstName}</span>
                    { userReview &&
                        <button id='reviewDeleteButton' onClick={() => handleReviewDelete(review.id)}>Delete</button>
                    }
                    </p>

                    <p id="reviewDate">{uploadDate.toDateString()}</p>
                    <p>{review.review} <span>&#183;</span> <i className="fa-solid fa-star"></i> {review.stars}</p>
                    { reviewImages &&
                      reviewImages.map(image => (
                        <img src={image.url} id="reviewImage" />
                      ))
                    }
                  <hr/>
                  </div>
                );
              }
              )
          }
        </div>

      </div>
    </div>
  );
}

export default SpotDetails;
