import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db';
import User from './models/User';
import Achievement from './models/Achievement';
import Notification from './models/Notification';
import generateReferralCode from './utils/generateReferralCode';
import { checkAndUnlockAchievements } from './services/achievementService';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Achievement.deleteMany({});
    await Notification.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create users with referral relationships
    // SONU (root)
    const sonu = await User.create({
      name: 'Sonu',
      username: 'sonu',
      email: 'demo@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'SONU91',
      referredBy: '',
      referralCount: 3,
      level: 1,
      role: 'admin',
      isActive: true,
    });

    // RAHUL (referred by SONU)
    const rahul = await User.create({
      name: 'Rahul',
      username: 'rahul',
      email: 'rahul@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'RAHUL82',
      referredBy: 'SONU91',
      referralCount: 2,
      level: 2,
      isActive: true,
    });

    // PRIYA (referred by SONU)
    const priya = await User.create({
      name: 'Priya',
      username: 'priya',
      email: 'priya@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'PRIYA45',
      referredBy: 'SONU91',
      referralCount: 2,
      level: 2,
      isActive: true,
    });

    // VIKASH (referred by SONU)
    const vikash = await User.create({
      name: 'Vikash',
      username: 'vikash',
      email: 'vikash@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'VIKASH67',
      referredBy: 'SONU91',
      referralCount: 0,
      level: 2,
      isActive: true,
    });

    // AMAN (referred by RAHUL)
    const aman = await User.create({
      name: 'Aman',
      username: 'aman',
      email: 'aman@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'AMAN33',
      referredBy: 'RAHUL82',
      referralCount: 2,
      level: 3,
      isActive: true,
    });

    // NEHA (referred by RAHUL)
    const neha = await User.create({
      name: 'Neha',
      username: 'neha',
      email: 'neha@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'NEHA19',
      referredBy: 'RAHUL82',
      referralCount: 0,
      level: 3,
      isActive: true,
    });

    // ROHIT (referred by AMAN)
    const rohit = await User.create({
      name: 'Rohit',
      username: 'rohit',
      email: 'rohit@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'ROHIT56',
      referredBy: 'AMAN33',
      referralCount: 0,
      level: 4,
      isActive: true,
    });

    // KARAN (referred by AMAN)
    const karan = await User.create({
      name: 'Karan',
      username: 'karan',
      email: 'karan@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'KARAN44',
      referredBy: 'AMAN33',
      referralCount: 0,
      level: 4,
      isActive: true,
    });

    // ARJUN (referred by PRIYA)
    const arjun = await User.create({
      name: 'Arjun',
      username: 'arjun',
      email: 'arjun@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'ARJUN78',
      referredBy: 'PRIYA45',
      referralCount: 0,
      level: 3,
      isActive: true,
    });

    // SAMEER (referred by PRIYA)
    const sameer = await User.create({
      name: 'Sameer',
      username: 'sameer',
      email: 'sameer@tirangaconnect.app',
      password: 'Demo@123',
      referralCode: 'SAMEER22',
      referredBy: 'PRIYA45',
      referralCount: 0,
      level: 3,
      isActive: true,
    });

    console.log('👥 Created 10 demo users');

    // Check achievements for users with referrals
    await checkAndUnlockAchievements(sonu._id.toString(), sonu.referralCount);
    await checkAndUnlockAchievements(rahul._id.toString(), rahul.referralCount);
    await checkAndUnlockAchievements(priya._id.toString(), priya.referralCount);
    await checkAndUnlockAchievements(aman._id.toString(), aman.referralCount);

    console.log('🏆 Created achievements');

    // Create sample notifications
    await Notification.create([
      {
        userId: sonu._id,
        title: 'Welcome to Tiranga Connect! 🇮🇳',
        message: 'You are now part of the network. Share your referral link to grow your connections!',
        type: 'system',
      },
      {
        userId: sonu._id,
        title: 'New Connection! 🇮🇳',
        message: 'Rahul joined the network through your referral link!',
        type: 'referral',
      },
      {
        userId: sonu._id,
        title: 'New Connection! 🇮🇳',
        message: 'Priya joined the network through your referral link!',
        type: 'referral',
      },
      {
        userId: sonu._id,
        title: 'New Connection! 🇮🇳',
        message: 'Vikash joined the network through your referral link!',
        type: 'referral',
      },
      {
        userId: rahul._id,
        title: 'Welcome to Tiranga Connect! 🇮🇳',
        message: 'You are now part of the network.',
        type: 'system',
      },
      {
        userId: rahul._id,
        title: 'New Connection! 🇮🇳',
        message: 'Aman joined through your referral link!',
        type: 'referral',
      },
    ]);

    console.log('🔔 Created sample notifications');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Seed data created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Demo Credentials:');
    console.log('   Email: demo@tirangaconnect.app');
    console.log('   Password: Demo@123');
    console.log('\n🌳 Referral Tree:');
    console.log('   SONU (SONU91)');
    console.log('   ├── RAHUL (RAHUL82)');
    console.log('   │   ├── AMAN (AMAN33)');
    console.log('   │   │   ├── ROHIT (ROHIT56)');
    console.log('   │   │   └── KARAN (KARAN44)');
    console.log('   │   └── NEHA (NEHA19)');
    console.log('   ├── PRIYA (PRIYA45)');
    console.log('   │   ├── ARJUN (ARJUN78)');
    console.log('   │   └── SAMEER (SAMEER22)');
    console.log('   └── VIKASH (VIKASH67)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
