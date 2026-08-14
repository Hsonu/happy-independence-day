import { Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user profile
// @route   GET /api/users/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found', error: 'USER_NOT_FOUND' });
      return;
    }
    res.status(200).json({ success: true, message: 'Profile retrieved', data: { user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, username, avatar } = req.body;
    const user = await User.findById(req.user!._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found', error: 'USER_NOT_FOUND' });
      return;
    }

    // Check username uniqueness if changing
    if (username && username.toLowerCase() !== user.username) {
      const existing = await User.findOne({ username: username.toLowerCase() });
      if (existing) {
        res.status(409).json({ success: false, message: 'Username already taken', error: 'DUPLICATE_USERNAME' });
        return;
      }
      user.username = username.toLowerCase();
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();
    res.status(200).json({ success: true, message: 'Profile updated', data: { user: updatedUser } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(422).json({ success: false, message: 'Current and new password required', error: 'VALIDATION_ERROR' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(422).json({ success: false, message: 'New password must be at least 6 characters', error: 'VALIDATION_ERROR' });
      return;
    }

    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found', error: 'USER_NOT_FOUND' });
      return;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Current password is incorrect', error: 'INVALID_PASSWORD' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully', data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Get user by referral code (public)
// @route   GET /api/users/referral/:code
export const getUserByReferralCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ referralCode: req.params.code.toUpperCase() });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found', error: 'USER_NOT_FOUND' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'User found',
      data: {
        user: {
          name: user.name,
          username: user.username,
          referralCode: user.referralCode,
          avatar: user.avatar,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};
