import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get admin stats
// @route   GET /api/admin/stats
export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

    const totalConnections = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$referralCount' } } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved',
      data: {
        totalUsers,
        activeUsers,
        newUsersToday,
        totalConnections: totalConnections[0]?.total || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { referralCode: { $regex: search, $options: 'i' } },
      ];
    }

    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Users retrieved',
      data: {
        users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/status
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found', error: 'NOT_FOUND' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};
