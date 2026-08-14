import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  buildReferralTree,
  getDirectReferrals,
  getReferralStats,
  getGrowthAnalytics,
} from '../services/referralService';
import User from '../models/User';

// @desc    Get my direct referrals
// @route   GET /api/referrals/my
export const getMyReferrals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const referrals = await User.find({ referredBy: req.user!.referralCode })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ referredBy: req.user!.referralCode });

    res.status(200).json({
      success: true,
      message: 'Referrals retrieved',
      data: {
        referrals,
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

// @desc    Get referral tree
// @route   GET /api/referrals/tree
export const getReferralTree = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const depth = parseInt(req.query.depth as string) || 5;
    const tree = await buildReferralTree(req.user!.referralCode, depth);

    res.status(200).json({
      success: true,
      message: 'Referral tree retrieved',
      data: { tree },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Get referral stats
// @route   GET /api/referrals/stats
export const getMyReferralStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await getReferralStats(req.user!.referralCode);

    res.status(200).json({
      success: true,
      message: 'Stats retrieved',
      data: {
        ...stats,
        level: req.user!.level,
        referralCode: req.user!.referralCode,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Get referral by code
// @route   GET /api/referrals/:code
export const getReferralByCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ referralCode: req.params.code.toUpperCase() })
      .select('name username referralCode referralCount level avatar createdAt');

    if (!user) {
      res.status(404).json({ success: false, message: 'Referral code not found', error: 'NOT_FOUND' });
      return;
    }

    const referrals = await getDirectReferrals(user.referralCode);

    res.status(200).json({
      success: true,
      message: 'Referral data retrieved',
      data: { user, referrals },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Get analytics data
// @route   GET /api/referrals/analytics
export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const period = (req.query.period as string) || '30d';
    const analytics = await getGrowthAnalytics(req.user!.referralCode, period);

    res.status(200).json({
      success: true,
      message: 'Analytics retrieved',
      data: analytics,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};
