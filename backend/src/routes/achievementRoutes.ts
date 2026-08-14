import { Router } from 'express';
import { getAchievements } from '../controllers/achievementController';
import protect from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getAchievements);

export default router;
