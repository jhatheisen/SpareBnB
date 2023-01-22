import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as spotsActions from '../../store/spots';
import './CreateSpot.css';

function CreateSpotModal() {

  const dispatch = useDispatch();
  const history = useHistory();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(100);
  const [lng, setLng] = useState(100);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const newSpot = {
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
      const createSpotResponse = await dispatch(spotsActions.createSpot(newSpot));

      const spotId = createSpotResponse.id;

      if (previewImage) {
        try {
          const spotImage = {
            url: previewImage,
            preview: true
          }

          const createSpotImageResponse = await dispatch(spotsActions.addSpotImage(spotImage, spotId))
        } catch (e) {
          const data = await e.json();
          if (data && data.errors) setErrors(data.errors);
        }
      }

      closeModal();
      history.push(`/spots/${spotId}`);
    } catch (e) {
      const data = await e.json();
      if (data && data.errors) setErrors(data.errors);
    }
  }

  return (
    <div className="createSpotContainer">
      <form onSubmit={handleSubmit} className="createSpotModal">
        <h1>Create A Spot</h1>
        <label for="address">
        Address
        </label>
          <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          />
        <label for="city">
        City
        </label>
          <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          />
        <label for="state">
        State
        </label>
          <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
          />
        <label for="country">
        Country
        </label>
          <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          />
        {/* <label for="lat">
        Latitude
        </label>
          <input
          type="text"
          id="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
          />
        <label for="lng">
        Longitude
        </label>
          <input
          type="text"
          id="lng"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
          /> */}
        <label for="name">
        Name
        </label>
          <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          />
        <label for="description">
        Description
        </label>
          <textarea
          type="textarea"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          />
        <label for="price">
        Price
        </label>
          <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          />
        <label for="previewImage">
        Preview Image URL
        </label>
          <input
          type="text"
          id="previewImage"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required
          />
        <button type="submit" id="updateSpotButton">Create</button>
      </form>

      <ul className="createSpotErrors">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
    </div>
  );
};

export default CreateSpotModal;
