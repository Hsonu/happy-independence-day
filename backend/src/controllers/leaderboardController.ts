import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get leaderboard
// @route   GET /api/leaderboard
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('name username avatar referralCount level createdAt')
      .sort({ referralCount: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    // Add rank
    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      referralCount: user.referralCount,
      level: user.level,
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: 'Leaderboard retrieved',
      data: {
        leaderboard,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};
