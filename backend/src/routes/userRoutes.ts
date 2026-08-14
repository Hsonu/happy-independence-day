import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getUserByReferralCode } from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/referral/:code', getUserByReferralCode);

export default router;
