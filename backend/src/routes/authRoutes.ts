import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import protect from '../middleware/authMiddleware';

import crypto from 'crypto';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(422).json({
        success: false,
        message: 'Name is required',
        error: 'VALIDATION_ERROR'
      });
      return;
    }

    // Generate unique username and email from the name
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digit random number
    const username = `${cleanName || 'user'}_${randomSuffix}`;
    const email = `${username}@tirangaconnect.local`;
    const dummyPassword = crypto.randomBytes(8).toString('hex'); // 16-character random password

    // Inject auto-generated fields into req.body
    req.body.username = username;
    req.body.email = email;
    req.body.password = dummyPassword;
    req.body.confirmPassword = dummyPassword;

    // Pass to the original register controller
    await register(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration preprocessing failed',
      error: 'SERVER_ERROR'
    });
  }
});
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
