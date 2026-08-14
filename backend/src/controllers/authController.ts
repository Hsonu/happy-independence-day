import { Request, Response } from 'express';
import User from '../models/User';
import Notification from '../models/Notification';
import { generateToken, setTokenCookie } from '../utils/generateToken';
import generateReferralCode from '../utils/generateReferralCode';
import { calculateLevel } from '../services/referralService';
import { checkAndUnlockAchievements } from '../services/achievementService';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password, confirmPassword, referralCode: refCode } = req.body;

    // Validation
    if (!name || !username || !email || !password || !confirmPassword) {
      res.status(422).json({
        success: false,
        message: 'All fields are required',
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(422).json({
        success: false,
        message: 'Passwords do not match',
        error: 'PASSWORD_MISMATCH',
      });
      return;
    }

    if (password.length < 6) {
      res.status(422).json({
        success: false,
        message: 'Password must be at least 6 characters',
        error: 'PASSWORD_TOO_SHORT',
      });
      return;
    }

    // Check duplicates
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: 'Email already registered',
        error: 'DUPLICATE_EMAIL',
      });
      return;
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      res.status(409).json({
        success: false,
        message: 'Username already taken',
        error: 'DUPLICATE_USERNAME',
      });
      return;
    }

    // Validate referral code if provided
    let referredBy = '';
    let level = 1;

    if (refCode) {
      const referrer = await User.findOne({ referralCode: refCode.toUpperCase() });
      if (!referrer) {
        res.status(400).json({
          success: false,
          message: 'Invalid referral code',
          error: 'INVALID_REFERRAL_CODE',
        });
        return;
      }

      // Prevent self-referral
      if (referrer.email === email.toLowerCase() || referrer.username === username.toLowerCase()) {
        res.status(400).json({
          success: false,
          message: 'You cannot refer yourself',
          error: 'SELF_REFERRAL',
        });
        return;
      }

      referredBy = refCode.toUpperCase();
      level = await calculateLevel(referredBy);
    }

    // Generate unique referral code
    const newReferralCode = await generateReferralCode(username);

    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      referralCode: newReferralCode,
      referredBy,
      level,
    });

    // Update referrer's count and check achievements
    if (referredBy) {
      const referrer = await User.findOneAndUpdate(
        { referralCode: referredBy },
        { $inc: { referralCount: 1 } },
        { new: true }
      );

      if (referrer) {
        // Create notification for referrer
        await Notification.create({
          userId: referrer._id,
          title: 'New Connection! 🇮🇳',
          message: `${name} joined the network through your referral link!`,
          type: 'referral',
        });

        // Check achievements for referrer
        await checkAndUnlockAchievements(referrer._id.toString(), referrer.referralCount);
      }
    }

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to Tiranga Connect! 🇮🇳',
      message: 'You are now part of the network. Share your referral link to grow your connections!',
      type: 'system',
    });

    // Generate token
    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          referralCount: user.referralCount,
          level: user.level,
          role: user.role,
          isActive: user.isActive,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
      error: 'SERVER_ERROR',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(422).json({
        success: false,
        message: 'Email and password are required',
        error: 'VALIDATION_ERROR',
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account has been deactivated',
        error: 'ACCOUNT_DEACTIVATED',
      });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS',
      });
      return;
    }

    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          referralCount: user.referralCount,
          level: user.level,
          role: user.role,
          isActive: user.isActive,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
      error: 'SERVER_ERROR',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved',
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user',
      error: 'SERVER_ERROR',
    });
  }
};
