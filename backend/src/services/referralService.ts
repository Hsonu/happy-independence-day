import User, { IUser } from '../models/User';

interface TreeNode {
  _id: string;
  name: string;
  username: string;
  referralCode: string;
  referralCount: number;
  level: number;
  avatar: string;
  createdAt: Date;
  children: TreeNode[];
}

// Build the referral tree recursively from a given referral code
export const buildReferralTree = async (referralCode: string, depth: number = 5): Promise<TreeNode | null> => {
  if (depth <= 0) return null;

  const user = await User.findOne({ referralCode });
  if (!user) return null;

  const directReferrals = await User.find({ referredBy: referralCode });

  const children: TreeNode[] = [];
  for (const referral of directReferrals) {
    const childNode = await buildReferralTree(referral.referralCode, depth - 1);
    if (childNode) {
      children.push(childNode);
    }
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    username: user.username,
    referralCode: user.referralCode,
    referralCount: user.referralCount,
    level: user.level,
    avatar: user.avatar,
    createdAt: user.createdAt,
    children,
  };
};

// Get direct referrals for a user
export const getDirectReferrals = async (referralCode: string): Promise<IUser[]> => {
  return await User.find({ referredBy: referralCode }).select('-password').sort({ createdAt: -1 });
};

// Count total network size (recursive)
export const getTotalNetworkSize = async (referralCode: string): Promise<number> => {
  const directReferrals = await User.find({ referredBy: referralCode });
  let count = directReferrals.length;

  for (const referral of directReferrals) {
    count += await getTotalNetworkSize(referral.referralCode);
  }

  return count;
};

// Calculate the level of a user in the referral chain
export const calculateLevel = async (referredBy: string): Promise<number> => {
  if (!referredBy) return 1;

  const referrer = await User.findOne({ referralCode: referredBy });
  if (!referrer) return 1;

  return referrer.level + 1;
};

// Get referral stats
export const getReferralStats = async (referralCode: string) => {
  const directReferrals = await User.find({ referredBy: referralCode });
  const totalNetwork = await getTotalNetworkSize(referralCode);

  // Growth calculation (last 7 days vs previous 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const recentReferrals = await User.countDocuments({
    referredBy: referralCode,
    createdAt: { $gte: sevenDaysAgo },
  });

  const previousReferrals = await User.countDocuments({
    referredBy: referralCode,
    createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
  });

  const growthPercentage = previousReferrals === 0
    ? recentReferrals * 100
    : Math.round(((recentReferrals - previousReferrals) / previousReferrals) * 100);

  // Growth data for charts (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const growthData = await User.aggregate([
    {
      $match: {
        referredBy: referralCode,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    directConnections: directReferrals.length,
    totalNetwork,
    growthPercentage,
    growthData,
    recentReferrals,
  };
};

// Get growth analytics data
export const getGrowthAnalytics = async (referralCode: string, period: string = '30d') => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(0); // All time
  }

  const growthData = await User.aggregate([
    {
      $match: {
        referredBy: referralCode,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Monthly distribution
  const monthlyData = await User.aggregate([
    {
      $match: {
        referredBy: referralCode,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { growthData, monthlyData };
};
