import express from 'express';
import { loginCitizen, forgotPasswordCitizen, resetPasswordCitizen, registerCitizen } from '../controllers/citizenController.js';
import { protect } from '../middleware/auth.js'; 
import authSectorHead from '../middleware/authSectorHead.js';
import { getCitizenProfile } from '../controllers/citizenController.js';
import authCitizen from '../middleware/authCitizen.js';

const router = express.Router();

router.post('https://civicconnect-1f9p.onrender.com/register', authSectorHead, registerCitizen);
router.post('https://civicconnect-1f9p.onrender.com/login', loginCitizen);
router.post('https://civicconnect-1f9p.onrender.com/forgot-password', forgotPasswordCitizen);
router.post('https://civicconnect-1f9p.onrender.com/reset-password/:token', resetPasswordCitizen);
router.get('https://civicconnect-1f9p.onrender.com/me', authCitizen, getCitizenProfile); 

export default router;
