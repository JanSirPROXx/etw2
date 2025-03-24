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
      scaledSize: {
        width: 40,
        height: 40,
        widthPercent: null,
        heightPercent: null,
        usePercentage: false,
      },
    },
    imageUrl: "",
    gallery: [],
  });

  // State for new gallery item
  const [newGalleryItem, setNewGalleryItem] = useState({
    url: "",
    caption: "",
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
        scaledSize: {
          width: location.icon.scaledSize.width,
          height: location.icon.scaledSize.height,
          widthPercent: location.icon.scaledSize.widthPercent,
          heightPercent: location.icon.scaledSize.heightPercent,
          usePercentage: location.icon.scaledSize.usePercentage || false,
        },
      },
      imageUrl: location.imageUrl || "",
      gallery: location.gallery || [],
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "icon") {
      setFormData({
        ...formData,
        icon: {
          ...formData.icon,
          url: value,
        },
      });
    } else if (name === "usePercentage") {
      setFormData({
        ...formData,
        icon: {
          ...formData.icon,
          scaledSize: {
            ...formData.icon.scaledSize,
            usePercentage: checked,
          },
        },
      });
    } else if (
      name === "width" ||
      name === "height" ||
      name === "widthPercent" ||
      name === "heightPercent"
    ) {
      setFormData({
        ...formData,
        icon: {
          ...formData.icon,
          scaledSize: {
            ...formData.icon.scaledSize,
            [name]:
              parseInt(value, 10) || (name.includes("Percent") ? 100 : 40),
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGalleryItemChange = (e) => {
    const { name, value } = e.target;
    setNewGalleryItem({
      ...newGalleryItem,
      [name]: value,
    });
  };

  const addGalleryItem = () => {
    if (!newGalleryItem.url) return;

    setFormData({
      ...formData,
      gallery: [...formData.gallery, { ...newGalleryItem }],
    });

    // Reset new item form
    setNewGalleryItem({ url: "", caption: "" });
  };

  const removeGalleryItem = (index) => {
    const updatedGallery = [...formData.gallery];
    updatedGallery.splice(index, 1);

    setFormData({
      ...formData,
      gallery: updatedGallery,
    });
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
        scaledSize: {
          width: 40,
          height: 40,
          widthPercent: null,
          heightPercent: null,
          usePercentage: false,
        },
      },
      imageUrl: "",
      gallery: [],
    });
    setNewGalleryItem({ url: "", caption: "" });
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
        scaledSize: {
          width: 40,
          height: 40,
          widthPercent: null,
          heightPercent: null,
          usePercentage: false,
        },
      },
      imageUrl: "",
      gallery: [],
    });
    setNewGalleryItem({ url: "", caption: "" });
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
                <th>Image</th>
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
                      {location.imageUrl ? (
                        <img
                          src={location.imageUrl}
                          alt={location.title}
                          style={{
                            width: "50px",
                            height: "30px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>No image</span>
                      )}
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
            <label htmlFor="imageUrl">Thumbnail Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img
                  src={formData.imageUrl}
                  alt="Thumbnail preview"
                  style={{
                    maxWidth: "100%",
                    marginTop: "8px",
                    maxHeight: "150px",
                  }}
                />
              </div>
            )}
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

            {/* Icon size settings */}
            <div className="icon-size-settings">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="usePercentage"
                  name="usePercentage"
                  checked={formData.icon.scaledSize.usePercentage}
                  onChange={handleChange}
                />
                <label htmlFor="usePercentage">Use percentage for size</label>
              </div>

              {formData.icon.scaledSize.usePercentage ? (
                <div className="size-inputs">
                  <div>
                    <label htmlFor="widthPercent">Width %:</label>
                    <input
                      type="number"
                      id="widthPercent"
                      name="widthPercent"
                      value={formData.icon.scaledSize.widthPercent || 100}
                      onChange={handleChange}
                      min="1"
                      max="200"
                    />
                  </div>
                  <div>
                    <label htmlFor="heightPercent">Height %:</label>
                    <input
                      type="number"
                      id="heightPercent"
                      name="heightPercent"
                      value={formData.icon.scaledSize.heightPercent || 100}
                      onChange={handleChange}
                      min="1"
                      max="200"
                    />
                  </div>
                </div>
              ) : (
                <div className="size-inputs">
                  <div>
                    <label htmlFor="width">Width px:</label>
                    <input
                      type="number"
                      id="width"
                      name="width"
                      value={formData.icon.scaledSize.width}
                      onChange={handleChange}
                      min="10"
                      max="100"
                    />
                  </div>
                  <div>
                    <label htmlFor="height">Height px:</label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.icon.scaledSize.height}
                      onChange={handleChange}
                      min="10"
                      max="100"
                    />
                  </div>
                </div>
              )}
            </div>
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

          {/* Gallery Management */}
          <div className="form-group gallery-section">
            <label>Gallery Images</label>

            {formData.gallery.length > 0 && (
              <div className="gallery-items">
                {formData.gallery.map((item, index) => (
                  <div key={index} className="gallery-item">
                    <img
                      src={item.url}
                      alt={item.caption || `Gallery image ${index + 1}`}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="gallery-item-details">
                      <p>{item.caption || "No caption"}</p>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeGalleryItem(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Gallery Item Form */}
            <div className="add-gallery-item">
              <input
                type="url"
                name="url"
                placeholder="Image URL"
                value={newGalleryItem.url}
                onChange={handleGalleryItemChange}
                className="gallery-url-input"
              />
              <input
                type="text"
                name="caption"
                placeholder="Image Caption (optional)"
                value={newGalleryItem.caption}
                onChange={handleGalleryItemChange}
                className="gallery-caption-input"
              />
              <button
                type="button"
                className="add-btn"
                onClick={addGalleryItem}
                disabled={!newGalleryItem.url}
              >
                Add Image
              </button>
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
                    scaledSize: new window.google.maps.Size(
                      formData.icon.scaledSize.width,
                      formData.icon.scaledSize.height
                    ),
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

      {/* Add some additional CSS for our new features */}
      <style jsx>{`
        .icon-size-settings {
          margin-top: 10px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }

        .checkbox-group {
          margin-bottom: 10px;
        }

        .size-inputs {
          display: flex;
          gap: 10px;
        }

        .size-inputs input {
          width: 70px;
          padding: 5px;
        }

        .gallery-section {
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }

        .gallery-items {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }

        .gallery-item {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          padding: 5px;
          border-radius: 4px;
        }

        .gallery-item-details {
          margin-left: 10px;
        }

        .gallery-item-details p {
          margin: 0 0 5px 0;
          font-size: 12px;
        }

        .add-gallery-item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .gallery-url-input {
          grid-column: 1 / 3;
        }

        .add-btn {
          grid-column: 1 / 3;
          background-color: #4a6eb5;
          color: white;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .add-btn:disabled {
          background-color: #cccccc;
        }

        .image-preview {
          margin-top: 5px;
          background-color: #f9f9f9;
          padding: 5px;
          border-radius: 4px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default LocationsManagement;
