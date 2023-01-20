import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './UserSpots.css';
import { loadUserSpots } from '../../store/spots';
import { useHistory } from 'react-router-dom';

function UserSpots() {

  const dispatch = useDispatch();
  const history = useHistory();
  const userSpots = useSelector(state => state.spots.UserSpots);

  useEffect(() => {
    dispatch(loadUserSpots());
  }, []);

  if (!userSpots) return null;

  return (
    <div className='userSpotsPageContainer'>
      <h1>Your Spots</h1>
      <hr id='userhr'/>
      <div className='userSpotsContainer'>
        { userSpots &&
          userSpots.Spots.map(spot => {

            let charLimit = 150;
            let description = spot.description;
            if (description.length > charLimit) description = description.substring(0, charLimit) + ' . . .';

            const onClick = () => {
              history.push(`/spots/${spot.id}`)
            }

            return (
              <div className='userSpotCard' onClick={onClick}>
                <img src={spot.previewImage} alt={spot.name} className='spotImage' />
                <div className="spotText">
                  <h4>{spot.city + ', ' + spot.state}</h4>
                  <p>{spot.name}</p>
                  <p><i className="fa-solid fa-star"></i>{spot.avgRating}</p>
                  <p><b>${spot.price}</b> night</p>
                </div>
              </div>
            );
          })
        }

      </div>
    </div>
  );
}
export default UserSpots;
