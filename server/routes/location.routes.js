import express from 'express';
import { protect, requireAdmin } from '../middleware/authentication.js';
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationsByUser,
  addToGallery,
  removeFromGallery
} from '../controllers/location.controller.js';

const router = express.Router();

router.use(protect);

// Protected routes
router.get('/', getAllLocations);
router.get('/:id',  getLocationById);
router.get('/user/:userId', getLocationsByUser);

// Protected routes (require admin)
router.post('/', requireAdmin, createLocation);
router.put('/:id', requireAdmin, updateLocation);
router.delete('/:id', requireAdmin, deleteLocation);

// Gallery management routes
router.post('/:id/gallery', requireAdmin, addToGallery);
router.delete('/:id/gallery/:imageIndex', requireAdmin, removeFromGallery);

export default router;