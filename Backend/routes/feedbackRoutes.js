import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';
import authCitizen from '../middleware/authCitizen.js';
import { protect } from '../middleware/auth.js';
import { getSectorWiseRatings } from '../controllers/feedbackController.js';
const router = express.Router();
router.post('https://civicconnect-1f9p.onrender.com/submit', authCitizen, submitFeedback);
router.get("https://civicconnect-1f9p.onrender.com/sector-ratings",  protect ,getSectorWiseRatings);
export default router;
