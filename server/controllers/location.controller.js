import Location from "../models/location.model.js";

/**
 * Get all locations
 * GET /api/locations
 * @access Public
 */
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find()
      .populate('createdBy', 'name') // Include creator name only
      .sort({ createdAt: -1 }); // Newest first
    
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get location by ID
 * GET /api/locations/:id
 * @access Public
 */
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new location
 * POST /api/locations
 * @access Private
 */
export const createLocation = async (req, res) => {
  try {
    const { title, description, position, icon, imageUrl, gallery } = req.body;
    
    // Validate required fields
    if (!title || !description || !position || !icon) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Validate position
    if (!position.lat || !position.lng) {
      return res.status(400).json({ message: 'Position must include latitude and longitude' });
    }
    
    // Create new location with current user as creator
    const newLocation = new Location({
      title,
      description,
      position,
      icon,
      imageUrl: imageUrl || null,
      gallery: gallery || [],
      createdBy: req.user._id
    });
    
    const savedLocation = await newLocation.save();
    
    // Return the saved location with creator details
    const populatedLocation = await Location.findById(savedLocation._id)
      .populate('createdBy', 'name email');
    
    res.status(201).json(populatedLocation);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a location
 * PUT /api/locations/:id
 * @access Private
 */
export const updateLocation = async (req, res) => {
  try {
    const { title, description, position, icon, imageUrl, gallery } = req.body;
    const locationId = req.params.id;
    
    // Find the location
    const location = await Location.findById(locationId);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check ownership unless admin
    if (location.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this location' });
    }
    
    // Update fields
    if (title) location.title = title;
    if (description) location.description = description;
    if (imageUrl !== undefined) location.imageUrl = imageUrl;
    if (gallery) location.gallery = gallery;
    
    if (position) {
      if (position.lat) location.position.lat = position.lat;
      if (position.lng) location.position.lng = position.lng;
    }
    
    if (icon) {
      if (icon.url) location.icon.url = icon.url;
      if (icon.scaledSize) {
        if (icon.scaledSize.width !== undefined) 
          location.icon.scaledSize.width = icon.scaledSize.width;
        if (icon.scaledSize.height !== undefined) 
          location.icon.scaledSize.height = icon.scaledSize.height;
        
        // Add percentage support
        if (icon.scaledSize.widthPercent !== undefined)
          location.icon.scaledSize.widthPercent = icon.scaledSize.widthPercent;
        if (icon.scaledSize.heightPercent !== undefined)
          location.icon.scaledSize.heightPercent = icon.scaledSize.heightPercent;
        if (icon.scaledSize.usePercentage !== undefined)
          location.icon.scaledSize.usePercentage = icon.scaledSize.usePercentage;
      }
    }
    
    // Save updated location
    const updatedLocation = await location.save();
    
    // Return the updated location with creator details
    const populatedLocation = await Location.findById(updatedLocation._id)
      .populate('createdBy', 'name email');
    
    res.json(populatedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add image to gallery
 * POST /api/locations/:id/gallery
 * @access Private
 */
export const addToGallery = async (req, res) => {
  try {
    const { url, caption } = req.body;
    const locationId = req.params.id;
    
    if (!url) {
      return res.status(400).json({ message: 'Please provide an image URL' });
    }
    
    // Find the location
    const location = await Location.findById(locationId);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check ownership unless admin
    if (location.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this location' });
    }
    
    // Add to gallery
    location.gallery.push({ url, caption: caption || '' });
    
    // Save updated location
    const updatedLocation = await location.save();
    
    // Return the updated location with creator details
    const populatedLocation = await Location.findById(updatedLocation._id)
      .populate('createdBy', 'name email');
    
    res.json(populatedLocation);
  } catch (error) {
    console.error('Error adding to gallery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Remove image from gallery
 * DELETE /api/locations/:id/gallery/:imageIndex
 * @access Private
 */
export const removeFromGallery = async (req, res) => {
  try {
    const locationId = req.params.id;
    const imageIndex = parseInt(req.params.imageIndex);
    
    if (isNaN(imageIndex)) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    
    // Find the location
    const location = await Location.findById(locationId);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check ownership unless admin
    if (location.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this location' });
    }
    
    // Check if image exists at that index
    if (imageIndex < 0 || imageIndex >= location.gallery.length) {
      return res.status(404).json({ message: 'Image not found in gallery' });
    }
    
    // Remove from gallery
    location.gallery.splice(imageIndex, 1);
    
    // Save updated location
    const updatedLocation = await location.save();
    
    // Return the updated location with creator details
    const populatedLocation = await Location.findById(updatedLocation._id)
      .populate('createdBy', 'name email');
    
    res.json(populatedLocation);
  } catch (error) {
    console.error('Error removing from gallery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * Delete a location
 * DELETE /api/locations/:id
 * @access Private
 */
export const deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    
    // Find the location
    const location = await Location.findById(locationId);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check ownership unless admin
    if (location.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this location' });
    }
    
    // Delete the location
    await Location.findByIdAndDelete(locationId);
    
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get locations by user ID
 * GET /api/locations/user/:userId
 * @access Public
 */
export const getLocationsByUser = async (req, res) => {
  try {
    const locations = await Location.find({ createdBy: req.params.userId })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(locations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};