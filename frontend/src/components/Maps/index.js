// frontend/src/components/Maps/index.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getKey } from '../../store/maps';
import Maps from './Maps';

const MapContainer = ({center: {lat, lng}}) => {
  const key = useSelector((state) => state.maps.key);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  if (!key) {
    return null;
  }

  return (
    <Maps apiKey={key} center={{lat, lng}} />
  );
};

export default MapContainer;
