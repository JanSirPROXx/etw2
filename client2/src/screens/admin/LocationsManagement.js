import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import {
  createLocationRequest,
  updateLocationRequest,
  deleteLocationRequest,
} from "../../redux/modules/location/locationActions";

// Map styles (same as in your Map.js)
const mapStyles = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
  },
  // ...other styles from your Map.js
];

const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
};

const center = {
  lat: 20,
  lng: 0,
};

const icons = [
  { name: "Default Marker", url: "/icons/marker.png" },
  { name: "Play Icon", url: "/icons/play-alt.png" },
  { name: "Rocket Icon", url: "/icons/rocket-lunch.png" },
  // Add more icons as needed
];

function LocationsManagement() {
  const dispatch = useDispatch();
  const { locations, loading, error } = useSelector((state) => state.location);
  const { user } = useSelector((state) => state.auth);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: { lat: null, lng: null },
    icon: {
      url: "/icons/marker.png",
      scaledSize: { width: 40, height: 40 },
    },
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setSelectedPosition(newPosition);
    setFormData({
      ...formData,
      position: newPosition,
    });
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setSelectedPosition(location.position);
    setFormData({
      title: location.title,
      description: location.description,
      position: location.position,
      icon: {
        url: location.icon.url,
        scaledSize: location.icon.scaledSize,
      },
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "icon") {
      setFormData({
        ...formData,
        icon: {
          ...formData.icon,
          url: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.position.lat || !formData.position.lng) {
      alert("Please select a position on the map");
      return;
    }

    const locationData = {
      ...formData,
      createdBy: user._id,
    };

    if (selectedLocation) {
      dispatch(updateLocationRequest(selectedLocation._id, locationData));
    } else {
      dispatch(createLocationRequest(locationData));
    }

    // Reset form
    setSelectedLocation(null);
    setSelectedPosition(null);
    setFormData({
      title: "",
      description: "",
      position: { lat: null, lng: null },
      icon: {
        url: "/icons/marker.png",
        scaledSize: { width: 40, height: 40 },
      },
    });
  };

  const handleDelete = (locationId) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      dispatch(deleteLocationRequest(locationId));
    }
  };

  const handleCancelEdit = () => {
    setSelectedLocation(null);
    setSelectedPosition(null);
    setFormData({
      title: "",
      description: "",
      position: { lat: null, lng: null },
      icon: {
        url: "/icons/marker.png",
        scaledSize: { width: 40, height: 40 },
      },
    });
  };

  return (
    <div className="admin-container locations-management">
      <div className="locations-list">
        <h2>Locations</h2>
        {loading ? (
          <p>Loading locations...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Coordinates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations &&
                locations.map((location) => (
                  <tr key={location._id}>
                    <td>{location.title}</td>
                    <td className="description-cell">
                      {location.description.substring(0, 30)}...
                    </td>
                    <td>
                      {location.position.lat.toFixed(4)},{" "}
                      {location.position.lng.toFixed(4)}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleSelectLocation(location)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(location._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="location-form">
        <h2>{selectedLocation ? "Edit Location" : "Create New Location"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Paris, Eiffel Tower"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe this location..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <select
              id="icon"
              name="icon"
              value={formData.icon.url}
              onChange={handleChange}
            >
              {icons.map((icon, index) => (
                <option key={index} value={icon.url}>
                  {icon.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Position</label>
            <div className="coordinates">
              <span>
                Lat:{" "}
                {selectedPosition
                  ? selectedPosition.lat.toFixed(6)
                  : "Not selected"}
              </span>
              <span>
                Lng:{" "}
                {selectedPosition
                  ? selectedPosition.lng.toFixed(6)
                  : "Not selected"}
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={!selectedPosition}
            >
              {selectedLocation ? "Update Location" : "Create Location"}
            </button>
            {selectedLocation && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="map-container admin-map">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              mapContainerId="admin-map-container"
              center={selectedPosition || center}
              zoom={selectedPosition ? 8 : 2}
              options={{
                styles: mapStyles,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
              onClick={handleMapClick}
              onLoad={onMapLoad}
            >
              {selectedPosition && (
                <Marker
                  position={selectedPosition}
                  icon={{
                    url: formData.icon.url,
                    scaledSize: {
                      width: formData.icon.scaledSize.width,
                      height: formData.icon.scaledSize.height,
                    },
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="loading-map">Loading Map...</div>
          )}
          <p className="map-instruction">Click on the map to set location</p>
        </div>
      </div>
    </div>
  );
}

export default LocationsManagement;
