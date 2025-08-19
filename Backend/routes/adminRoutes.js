import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendBroadcastEmail } from '../controllers/adminController.js';
import { getDashboardSummary } from '../controllers/adminController.js';
import { exportAllIssues } from '../controllers/adminController.js';
import { getAdminProfile } from '../controllers/adminController.js';
const router = express.Router();
router.post('https://civicconnect-1f9p.onrender.com/broadcast', protect, sendBroadcastEmail);
router.get('https://civicconnect-1f9p.onrender.com/dashboard-summary', protect, getDashboardSummary);
router.get('https://civicconnect-1f9p.onrender.com/export-issues', protect, exportAllIssues);
router.get("https://civicconnect-1f9p.onrender.com//profile", protect, getAdminProfile);
export default router;







