// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import HomePage from './components/HomePage';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/' component={HomePage}/>
        </Switch>
      )}
    </>
  );
}

export default App;
