import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './map.css';
import {useDispatch, useSelector} from 'react-redux';
import { fetchLocationsRequest } from '../../redux/modules/location/locationActions';

// Custom map styles - this is just an example, you can customize it further
const mapStyles = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { lightness: 17 }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }, { lightness: 18 }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dedede' }, { lightness: 21 }]
  }
];

// Define locations with data for markers
const locations = [
  {
    id: 1,
    position: { lat: 48.8566, lng: 2.3522 },
    title: 'Paris',
    description: 'The City of Light and Love',
    icon: {
      url: '/icons/marker.png', // Add your custom icon
      scaledSize: { width: 40, height: 40 }
    }
  },
  {
    id: 2,
    position: { lat: 40.7128, lng: -74.006 },
    title: 'New York',
    description: 'The Big Apple - a global metropolis',
    icon: {
      url: '/icons/play-alt.png',
      scaledSize: { width: 40, height: 40 }
    }
  },
  {
    id: 3,
    position: { lat: 35.6762, lng: 139.6503 },
    title: 'Tokyo',
    description: 'Japan\'s busy capital - mixing ultramodern and traditional',
    icon: {
      url: '/icons/rocket-lunch.png',
      scaledSize: { width: 40, height: 40 }
    }
  }
];

const containerStyle = {
  width: '100%',
  height: '91vh'
};

const center = {
  lat: 20, // Default center
  lng: 0
};

function Map() {
  const dispatch = useDispatch();
  const { locations, loading: locationsLoading } = useSelector(state => state.location);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  
  // For storing refs to markers for mouseover handling
  const markerRefs = useRef({});
  
  // Fetch locations when component mounts
  useEffect(() => {
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMarkerClick = (markerId) => {
    setActiveMarker(markerId);
  };

  const handleMarkerMouseOver = (markerId) => {
    setHoveredMarker(markerId);
  };

  const handleMarkerMouseOut = () => {
    setHoveredMarker(null);
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  // Helper function to set marker refs
  const setMarkerRef = (marker, id) => {
    if (marker) {
      markerRefs.current[id] = marker;
    }
  };

  return isLoaded ? (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={3}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {locations.map(location => (
          <Marker
            key={location._id}
            position={location.position}
            icon={location.icon}
            onClick={() => handleMarkerClick(location._id)}
            onMouseOver={() => handleMarkerMouseOver(location._id)}
            onMouseOut={handleMarkerMouseOut}
            ref={(marker) => setMarkerRef(marker, location._id)}
          />
        ))}

        {/* Show info window for clicked marker */}
        {activeMarker && (
          <InfoWindow
            position={locations.find(loc => loc._id === activeMarker).position}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="info-window">
              <h3>{locations.find(loc => loc._id === activeMarker).title}</h3>
              <p>{locations.find(loc => loc._id === activeMarker).description}</p>
              <p className="creator">
                Added by: {locations.find(loc => loc._id === activeMarker).createdBy.name}
              </p>
            </div>
          </InfoWindow>
        )}

        {/* Show info window for hovered marker (if not the same as active) */}
        {hoveredMarker && hoveredMarker !== activeMarker && (
          <InfoWindow
            position={locations.find(loc => loc._id === hoveredMarker).position}
          >
            <div className="info-window">
              <h3>{locations.find(loc => loc._id === hoveredMarker).title}</h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading Map...</div>
  );
}

export default Map;