import express from 'express';
import Admin from '../models/Admin.js';
import { registerSectorHead, loginSectorHead, forgotPasswordSectorHead, resetPasswordSectorHead, getAllIssuesInSector } from '../controllers/sectorHeadController.js';
import { protect } from '../middleware/auth.js';  
import authSectorHead from '../middleware/authSectorHead.js';
import { getSectorDashboardSummary } from '../controllers/sectorHeadController.js';
import { getSectorAnalytics } from '../controllers/analyticsController.js';
import { getSectorHeadDetails } from '../controllers/sectorHeadController.js';
import { sendBroadcastEmailSectorHead } from '../controllers/sectorHeadController.js';
import { getCitizensWithIssuesBySector } from '../controllers/sectorHeadController.js';
// import { getSectorAverageRating } from '../controllers/sectorHeadController.js';
// import { getCitizenDetails } from '../controllers/sectorHeadController.js';
import { getSectorWiseRatings } from '../controllers/sectorHeadController.js';
const router = express.Router();
const isAdmin = async (req, res, next) => {
  const user = await Admin.findById(req.user.id);
  if (user) {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
// router.get('/citizen/:id', authSectorHead, getCitizenDetails);
router.get('https://civicconnect-1f9p.onrender.com/dashboard-summary', authSectorHead, getSectorDashboardSummary);
router.post('https://civicconnect-1f9p.onrender.com/register', protect, isAdmin, registerSectorHead);
router.post('https://civicconnect-1f9p.onrender.com/login', loginSectorHead);
router.post('https://civicconnect-1f9p.onrender.com/forgot-password', forgotPasswordSectorHead);
router.post('https://civicconnect-1f9p.onrender.com/reset-password/:token', resetPasswordSectorHead);
router.get('https://civicconnect-1f9p.onrender.com/issues', protect, authSectorHead, getAllIssuesInSector);
router.get('https://civicconnect-1f9p.onrender.com/analytics', protect, authSectorHead, getSectorAnalytics);
router.get("https://civicconnect-1f9p.onrender.com/me", authSectorHead, getSectorHeadDetails);
router.post('https://civicconnect-1f9p.onrender.com/broadcast', authSectorHead, sendBroadcastEmailSectorHead);
router.get('https://civicconnect-1f9p.onrender.com/sector-citizens', authSectorHead, getCitizensWithIssuesBySector);
router.get('https://civicconnect-1f9p.onrender.com/average-rating', authSectorHead, getSectorWiseRatings);

export default router;
