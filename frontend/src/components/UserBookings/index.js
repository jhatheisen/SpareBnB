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
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            start.setDate(start.getDate() + 1)
            end.setDate(end.getDate() + 1)
            const { spotId }= booking;
            return (
              <div className='bookingCard'>
                <button onClick={() => {directSpot(spotId)}}>View Spot</button>
                <h4>Start: {start.toDateString()}</h4>
                <h4>End: {end.toDateString()}</h4>
              </div>
              )
            })
          }
      </div>
    </div>
  );
}

export default UserBookings;
