import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../store/bookings';
import './UserBookings.css';

function UserBookings() {

  const dispatch = useDispatch();
  const history = useHistory();
  const bookings = useSelector(state => state.bookings.Bookings);

  useEffect(()=> {
    dispatch(bookingActions.loadUserBookings());
  }, []);

  const directSpot = (spotId) => {
    history.push(`/spots/${spotId}`);
  }

  return (
    <div className='pageContainer'>
      <h1>Bookings</h1>
      <div className='bookingsContainer'>
        {
          bookings &&
          bookings.map(booking => {
            let start = Date.parse(booking.startDate);
            let end = Date.parse(booking.endDate);
            start = new Date(start).toDateString();
            end = new Date(end).toDateString();
            const { spotId }= booking;
            return (
              <div className='bookingCard'>
                <button onClick={() => {directSpot(spotId)}}>View Spot</button>
                <h4>Start: {start}</h4>
                <h4>End: {end}</h4>
              </div>
              )
            })
          }
      </div>
    </div>
  );
}

export default UserBookings;
