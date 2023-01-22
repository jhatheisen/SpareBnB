import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as spotsActions from '../../store/spots';
import './EditSpot.css';

function EditSpotPage() {

  const dispatch = useDispatch();
  const history = useHistory();
  const {spotId} = useParams();
  let targetSpot = useSelector(state => state.spots.detailSpot);


  useEffect(() => {
    dispatch(spotsActions.showDetailSpot(spotId));
  }, []);

  const [address, setAddress] = useState(targetSpot.address);
  const [city, setCity] = useState(targetSpot.city);
  const [state, setState] = useState(targetSpot.state);
  const [country, setCountry] = useState(targetSpot.country);
  const [lat, setLat] = useState(targetSpot.lat);
  const [lng, setLng] = useState(targetSpot.lng);
  const [name, setName] = useState(targetSpot.name);
  const [description, setDescription] = useState(targetSpot.description);
  const [price, setPrice] = useState(targetSpot.price);
  const [previewImage, setPreviewImage] = useState(targetSpot.previewImage);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const editedSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      previewImage
    }

    try {
      const editResponse = await dispatch(spotsActions.editSpot(editedSpot, spotId));
      if (await editResponse.ok) {
        history.goBack();
      }
    } catch (e) {
      const data = await e.json()
      if (data && data.errors) setErrors(data.errors)
    }

  }

  return (
    <div className="editSpotContainer">
      <div className="editSpotTitleDiv">
        <h1>Edit Spot</h1>
        <button onClick={() => history.goBack()} id='backButton'>Go Back</button>
      </div>
      <form onSubmit={handleSubmit} className="editSpotPage">
        <label for="address">
        Address
        </label>
          <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          />
        <label for="city">
        City
        </label>
          <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          />
        <label for="state">
        State
        </label>
          <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          />
        <label for="country">
        Country
        </label>
          <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          />
        <label for="lat">
        Latitude
        </label>
          <input
          type="text"
          id="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          />
        <label for="lng">
        Longitude
        </label>
          <input
          type="text"
          id="lng"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          />
        <label for="name">
        Name
        </label>
          <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        <label for="description">
        Description
        </label>
          <textarea
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          />
        <label for="price">
        Price
        </label>
          <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          />
        {/* <label for="previewImage">
        Preview Image URL
        </label>
          <input
          type="text"
          id="previewImage"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          /> */}
        <button type="submit" id="updateSpotButton">Update</button>
      </form>

      <ul className="editSpotErrors">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
    </div>
  );
};

export default EditSpotPage;
