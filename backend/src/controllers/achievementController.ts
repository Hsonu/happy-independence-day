import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getUserAchievements, getAllAchievementDefinitions } from '../services/achievementService';

// @desc    Get user achievements
// @route   GET /api/achievements
export const getAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userAchievements = await getUserAchievements(req.user!._id.toString());
    const allAchievements = getAllAchievementDefinitions();

    // Merge: show all achievements with unlocked status
    const achievements = allAchievements.map((def) => {
      const unlocked = userAchievements.find((a) => a.achievementId === def.achievementId);
      return {
        ...def,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt || null,
        progress: Math.min(req.user!.referralCount, def.threshold),
      };
    });

    res.status(200).json({
      success: true,
      message: 'Achievements retrieved',
      data: { achievements },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};
