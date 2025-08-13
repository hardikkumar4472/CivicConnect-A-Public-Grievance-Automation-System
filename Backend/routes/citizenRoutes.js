import express from 'express';
import { loginCitizen, forgotPasswordCitizen, resetPasswordCitizen, registerCitizen } from '../controllers/citizenController.js';
import { protect } from '../middleware/auth.js'; 
import { isSectorHead } from '../middleware/roles.js'; 
import { getCitizenProfile } from '../controllers/citizenController.js';
import authCitizen from '../middleware/authCitizen.js';

const router = express.Router();

router.post('/register', protect, isSectorHead, registerCitizen);
router.post('/login', loginCitizen);
router.post('/forgot-password', forgotPasswordCitizen);
router.post('/reset-password/:token', resetPasswordCitizen);
router.get('/me', authCitizen, getCitizenProfile); 

export default router;
