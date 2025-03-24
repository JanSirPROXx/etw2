import express from 'express';
import { register, login, logout, verifyToken } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authentication.js';

const router = express.Router();


router.post('/register',register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', protect, verifyToken);

export default router;