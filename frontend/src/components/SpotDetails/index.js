import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showDetailSpot } from "../../store/spots";
import './SpotDetails.css';

function SpotDetails() {

  useEffect(() => {
    dispatch(showDetailSpot(spotId));
  }, []);

  const { spotId } = useParams();
  const dispatch = useDispatch();
  const detailedSpot = useSelector(state => state.spots.detailSpot);

  if (!detailedSpot) return null;

  const {name, avgStarRating, numReviews, city, state, country, SpotImages, Owner, description, price} = detailedSpot;

  console.log(detailedSpot)

  return (
    <div className="outsideContainer">
      <div className="spotContainer">

        <h1 className="spotName">{name}</h1>
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
        </div>

        <div className="bookingContainer">
          <h2>${price} night</h2>
          <p><i className="fa-solid fa-star"></i>{avgStarRating}</p>
          <span>&#183;</span>
          <p><u>{numReviews} reviews</u></p>
        </div>

      </div>
    </div>
  );
}

export default SpotDetails;
