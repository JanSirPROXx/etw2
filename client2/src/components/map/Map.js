import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./map.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationsRequest } from "../../redux/modules/location/locationActions";

// Custom map styles - this is just an example, you can customize it further
const mapStyles = [
  // Base land styling
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }], // Light background for land
  },
  // Ocean styling
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cde9f5" }], // Light blue for water
  },
  // Hide all labels by default
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  // Show only country labels
  {
    featureType: "administrative.country",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  // Keep country boundaries visible
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d8d8d8" }, { weight: 0.5 }],
  },
  // Hide all roads
  {
    featureType: "road",
    stylers: [{ visibility: "off" }],
  },
  // Hide points of interest
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  // Hide transit
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
];

// Define locations with data for markers

const containerStyle = {
  width: "100%",
  height: "91vh",
};

const center = {
  lat: 20, // Default center
  lng: 0,
};

function Map() {
  const dispatch = useDispatch();
  const { locations, loading: locationsLoading } = useSelector(
    (state) => state.location
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const hoverTimeoutRef = useRef(null); // Add this new ref for timeout

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
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredMarker(markerId);
  };

  const handleMarkerMouseOut = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMarker(null);
    }, 300); // 300ms delay before hiding
  };

  const handleInfoWindowMouseOver = () => {
    // Keep InfoWindow open when mouse is over it
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleInfoWindowMouseOut = () => {
    // Hide InfoWindow when mouse leaves it
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
          disableDefaultUI: true, // Hide all controls
          zoomControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          minZoom: 2, // Prevent zooming out too far
          maxZoom: 7, // Optional: limit maximum zoom
          backgroundColor: "#f5f5f5", // Match your land color
          draggableCursor: "default",
          restriction: {
            latLngBounds: {
              north: 85, // Maximum north latitude
              south: -85, // Maximum south latitude
              west: -180,
              east: 180,
            },
            strictBounds: true, // Allow horizontal wrapping
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {locations.map((location) => (
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
            position={
              locations.find((loc) => loc._id === activeMarker).position
            }
            onCloseClick={handleInfoWindowClose}
          >
            <div className="info-window">
              {/* Image at the top - you'll need to add imageUrl to your location data */}
              <img
                src={
                  locations.find((loc) => loc._id === activeMarker).imageUrl ||
                  "https://via.placeholder.com/280x140"
                }
                alt={locations.find((loc) => loc._id === activeMarker).title}
                className="info-window-img"
              />

              <div className="info-window-content">
                <h3>
                  {locations.find((loc) => loc._id === activeMarker).title}
                </h3>
                <p>
                  {locations
                    .find((loc) => loc._id === activeMarker)
                    .description.substring(0, 100)}
                  {locations.find((loc) => loc._id === activeMarker).description
                    .length > 100
                    ? "..."
                    : ""}
                </p>

                <button className="read-more-btn">Read more</button>

                <p className="creator">
                  Added by:{" "}
                  {
                    locations.find((loc) => loc._id === activeMarker).createdBy
                      .name
                  }
                </p>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Show info window for hovered marker (if not the same as active) */}
        {/* {hoveredMarker && hoveredMarker !== activeMarker && (
          <InfoWindow
            position={
              locations.find((loc) => loc._id === hoveredMarker).position
            }
            onCloseClick={() => setHoveredMarker(null)}
          >
            <div
              className="info-window"
              onMouseOver={handleInfoWindowMouseOver}
              onMouseOut={handleInfoWindowMouseOut}
            >
              <h3>
                {locations.find((loc) => loc._id === hoveredMarker).title}
              </h3>
            </div>
          </InfoWindow>
        )} */}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading Map...</div>
  );
}

export default Map;
