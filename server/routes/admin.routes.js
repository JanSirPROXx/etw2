import express from 'express';
import { protect, requireAdmin } from '../middleware/authentication.js';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  createUser 
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(protect);
router.use(requireAdmin);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users', createUser);

export default router;