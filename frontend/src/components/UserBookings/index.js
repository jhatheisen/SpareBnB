import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../store/bookings';
import './UserBookings.css';

function UserBookings() {

  const dispatch = useDispatch();
  const history = useHistory();
  const bookings = useSelector(state => state.bookings.Bookings);

  const [currDate, setCurrDate] = useState(new Date());
  const [errors, setErrors] = useState([]);

  useEffect(()=> {
    dispatch(bookingActions.loadUserBookings());
  }, []);

  const directSpot = (spotId) => {
    history.push(`/spots/${spotId}`);
  }

  const deleteBooking = async (bookingId) => {

    const deleting = window.confirm("Are you sure you want to delete this booking?");

    if (deleting) {

      try {
        const deleteBookingResponse = await dispatch(bookingActions.deleteBooking(bookingId));
        if (await deleteBookingResponse.ok) {
          window.alert('Booking Deleted');
          history.go(0);
        }

      } catch (e) {
        const data = await e.json();
        if (data && data.message) setErrors([data.message])
      }
    }
  }

  return (
    <div className='pageContainer'>
      <h1>Your Bookings</h1>
      <hr id='bookingsHr'/>
      <ul className="deleteBookingErrors">
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <div className='bookingsContainer'>
        {
          bookings &&
          bookings.map((booking) => {

            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            start.setDate(start.getDate() + 1)
            end.setDate(end.getDate() + 1)

            const started = start <= currDate;
            const ended = end <= currDate;
            const { spotId, id }= booking;

            return (
              <div className='bookingCard'>
                <button id='bookingButton' onClick={() => {directSpot(spotId)}}>View Spot</button>
                { !started && !ended &&
                <div>
                  <button id='bookingButton' onClick={() => {deleteBooking(id)}}>Delete Booking</button>
                  <h3 id='status'>Status: Upcoming</h3>
                </div>
                }
                { started && !ended &&
                    <h3 id='status'>Status: Started</h3>
                }
                { started && ended &&
                    <h3 id='ended'>Status: Ended</h3>
                }
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
