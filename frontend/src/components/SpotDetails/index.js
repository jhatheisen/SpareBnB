import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { showDetailSpot } from "../../store/spots";
import './SpotDetails.css';
import MapContainer from '../Maps/index';
import * as spotsActions from '../../store/spots';
import * as bookingActions from '../../store/bookings';

function SpotDetails() {

  useEffect(() => {
    dispatch(showDetailSpot(spotId));
  }, []);

  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const detailedSpot = useSelector(state => state.spots.detailSpot);
  const user = useSelector(state => state.session.user);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState([]);

  let ownedSpot = null;

  if (!detailedSpot) return null;

  if (user) {
    ownedSpot = detailedSpot.ownerId == user.id;
  }

  const {name, avgStarRating, numReviews, city, state, country, SpotImages, Owner, description, price, lat, lng} = detailedSpot;

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
    const deleting = window.confirm("Are you sure about that?");
    if (deleting) {
      dispatch(spotsActions.deleteSpot(spotId));
      history.push('/');
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
          <hr/>
          <MapContainer center={{lat, lng}}/>
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
