import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { showDetailSpot } from "../../store/spots";
import './SpotDetails.css';
import MapContainer from '../Maps/index';

function SpotDetails() {

  useEffect(() => {
    dispatch(showDetailSpot(spotId));
  }, []);

  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const detailedSpot = useSelector(state => state.spots.detailSpot);
  const user = useSelector(state => state.session.user);
  let ownedSpot = null;

  if (!detailedSpot) return null;

  if (user) {
    ownedSpot = detailedSpot.ownerId == user.id;
  }

  const {name, avgStarRating, numReviews, city, state, country, SpotImages, Owner, description, price, lat, lng} = detailedSpot;

  const handleEdit = () => {
    history.push(`/spots/edit/${spotId}`);
  }

  return (
    <div className="outsideContainer">
      <div className="spotContainer">

        <h1 className="spotName">{name}</h1>
          {ownedSpot &&
            <button className="editButton" onClick={handleEdit}>Edit</button>
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
        </div>

      </div>
    </div>
  );
}

export default SpotDetails;
