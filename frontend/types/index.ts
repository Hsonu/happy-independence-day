export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  referralCode: string;
  referredBy: string;
  referralCount: number;
  level: number;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TreeNode {
  _id: string;
  name: string;
  username: string;
  referralCode: string;
  referralCount: number;
  level: number;
  avatar: string;
  createdAt: string;
  children: TreeNode[];
}

export interface ReferralStats {
  directConnections: number;
  totalNetwork: number;
  growthPercentage: number;
  growthData: { _id: string; count: number }[];
  recentReferrals: number;
  level: number;
  referralCode: string;
}

export interface Achievement {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'referral' | 'achievement' | 'milestone' | 'system';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  _id: string;
  name: string;
  username: string;
  avatar: string;
  referralCount: number;
  level: number;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalConnections: number;
}

export interface GrowthData {
  _id: string;
  count: number;
}

export interface AnalyticsData {
  growthData: GrowthData[];
  monthlyData: GrowthData[];
}
