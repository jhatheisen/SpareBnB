import { useDispatch, useSelector } from "react-redux";
import { loadSpots, nextPageSpots } from "../../store/spots";
import { useEffect } from "react";
import './homepage.css'
import { useHistory } from "react-router-dom";

function HomePage() {

  const dispatch = useDispatch();
  const history = useHistory();
  const spots = useSelector(state => state.spots);
  const currPage = useSelector(state => state.spots.page);

  useEffect(() => {
    dispatch(loadSpots());
  }, []);

  // console.log(spots.Spots);
  // if (!spots.Spots.length) return null;

  return (
    <>
      <div className="homepageContentDiv">
        {spots &&
          spots.Spots.map(spot => {

            let charLimit = 150;
            let description = spot.description;
            if (description.length > charLimit) description = description.substring(0, charLimit) + ' . . .';

            const onClick = () => {
              console.log('clicked');
              history.push(`/spots/${spot.id}`)
            }

            return (
              <div className="spotCard" onClick={onClick}>
                <img src={spot.previewImage} alt={spot.name} className='spotImage' />
                <div className="spotText">
                  <h4>{spot.city + ', ' + spot.state}</h4>
                  <p>{spot.name}</p>
                  <p><i className="fa-solid fa-star"></i>{spot.avgRating}</p>
                  <p><b>${spot.price}</b> night</p>
                </div>
              </div>
            )
            }
          )
        }
        <button className="loadMoreButton" onClick={() => dispatch(nextPageSpots(currPage + 1))}>Load More Spots...</button>
      </div>
    </>
  );
}

export default HomePage;
