// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import HomePage from './components/HomePage';
import SpotDetails from './components/SpotDetails';
import EditSpotPage from './components/EditSpotPage';
import UserBookings from './components/UserBookings';
import UserSpots from './components/UserSpots';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div onScroll={() => console.log('scrolling')}>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <Route path='/spots/edit/:spotId' component={EditSpotPage}/>
          <Route path='/spots/:spotId' component={SpotDetails}/>
          <Route path='/user/bookings' component={UserBookings}/>
          <Route path='/user/spots' component={UserSpots}/>
        </Switch>
      )}
    </div>
  );
}

export default App;
