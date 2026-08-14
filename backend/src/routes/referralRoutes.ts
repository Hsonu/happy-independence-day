import { Router } from 'express';
import {
  getMyReferrals,
  getReferralTree,
  getMyReferralStats,
  getReferralByCode,
  getAnalytics,
} from '../controllers/referralController';
import protect from '../middleware/authMiddleware';

const router = Router();

router.get('/my', protect, getMyReferrals);
router.get('/tree', protect, getReferralTree);
router.get('/stats', protect, getMyReferralStats);
router.get('/analytics', protect, getAnalytics);
router.get('/:code', protect, getReferralByCode);

export default router;
