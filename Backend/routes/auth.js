import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/authController.js';

import { registerSectorHead, loginSectorHead} from '../controllers/sectorHeadController.js';
const router = express.Router();
router.post('https://civicconnect-1f9p.onrender.com/admin', registerAdmin);
router.post('https://civicconnect-1f9p.onrender.com/login', loginAdmin);
export default router;
