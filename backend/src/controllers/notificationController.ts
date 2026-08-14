import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user notifications
// @route   GET /api/notifications
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ userId: req.user!._id });
    const unreadCount = await Notification.countDocuments({ userId: req.user!._id, isRead: false });

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data: {
        notifications,
        unreadCount,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found', error: 'NOT_FOUND' });
      return;
    }

    res.status(200).json({ success: true, message: 'Marked as read', data: { notification } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { userId: req.user!._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read', data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found', error: 'NOT_FOUND' });
      return;
    }

    res.status(200).json({ success: true, message: 'Notification deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error: 'SERVER_ERROR' });
  }
};
