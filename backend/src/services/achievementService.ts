import Achievement from '../models/Achievement';
import Notification from '../models/Notification';

const ACHIEVEMENTS = [
  {
    achievementId: 'first_connection',
    title: '🇮🇳 First Connection',
    description: 'Made your first referral connection',
    icon: '🇮🇳',
    threshold: 1,
  },
  {
    achievementId: 'unity_builder',
    title: '🟠 Unity Builder',
    description: 'Connected 5 people to the network',
    icon: '🟠',
    threshold: 5,
  },
  {
    achievementId: 'nation_connector',
    title: '⚪ Nation Connector',
    description: 'Connected 10 people to the network',
    icon: '⚪',
    threshold: 10,
  },
  {
    achievementId: 'india_networker',
    title: '🟢 India Networker',
    description: 'Connected 25 people to the network',
    icon: '🟢',
    threshold: 25,
  },
  {
    achievementId: 'ashoka_champion',
    title: '🔵 Ashoka Champion',
    description: 'Connected 50 people to the network',
    icon: '🔵',
    threshold: 50,
  },
  {
    achievementId: 'unity_legend',
    title: '🇮🇳 Unity Legend',
    description: 'Connected 100 people to the network',
    icon: '🇮🇳',
    threshold: 100,
  },
];

export const checkAndUnlockAchievements = async (
  userId: string,
  referralCount: number
): Promise<string[]> => {
  const unlockedNew: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (referralCount >= achievement.threshold) {
      // Check if already unlocked
      const existing = await Achievement.findOne({
        userId,
        achievementId: achievement.achievementId,
      });

      if (!existing) {
        // Unlock the achievement
        await Achievement.create({
          userId,
          ...achievement,
        });

        // Create notification
        await Notification.create({
          userId,
          title: 'Achievement Unlocked! 🎉',
          message: `You unlocked "${achievement.title}" — ${achievement.description}`,
          type: 'achievement',
        });

        unlockedNew.push(achievement.title);
      }
    }
  }

  return unlockedNew;
};

export const getAllAchievementDefinitions = () => ACHIEVEMENTS;

export const getUserAchievements = async (userId: string) => {
  return await Achievement.find({ userId }).sort({ threshold: 1 });
};
