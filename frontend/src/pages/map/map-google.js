import React, { useEffect, useContext, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function MapGoogle() {
  const context = useContext(AppSettings);
  const [map, setMap] = useState(null); // eslint-disable-line no-unused-vars
  
  var center = {
		lat: -3.745,
		lng: -38.523
  };
  
	var containerStyle = {
		width: '100%',
		height: '100%'
	};
	
	var { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ""
  })
  
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(this.center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0 position-relative');

    return () => {
      context.handleSetAppContentFullHeight(false);
      context.handleSetAppContentClass('');
    };
    
		// eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="position-absolute w-100 h-100 top-0 start-0 bottom-0 end-0">
        { isLoaded ? (
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={10}
						onLoad={onLoad}
						onUnmount={onUnmount}
					>
					</GoogleMap>
				) : <></>
				}
      </div>

      <div className="app-content-padding position-relative">
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item"><Link to="/map" className="text-white">Home</Link></li>
          <li className="breadcrumb-item active text-white">Map</li>
        </ol>
        <h1 className="page-header text-white">Google Map <small className="text-white-transparent-5">header small text goes here...</small></h1>
      </div>
    </div>
  );
}

export default MapGoogle;