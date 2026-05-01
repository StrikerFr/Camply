import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// Achievements table doesn't exist yet - using static achievements
// that can be replaced with real data once the table is created

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  points_required: number;
  category: string | null;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

// Static achievements until the table is created
const staticAchievements: Achievement[] = [
  { id: "1", name: "First Steps", description: "Complete your profile setup", icon: "🎯", points_required: 0, category: "onboarding" },
  { id: "2", name: "First Hackathon", description: "Participate in your first hackathon", icon: "🏆", points_required: 0, category: "participation" },
  { id: "3", name: "Team Player", description: "Join or create 3 teams", icon: "🤝", points_required: 0, category: "social" },
  { id: "4", name: "Rising Star", description: "Earn your first 500 points", icon: "⭐", points_required: 500, category: "points" },
  { id: "5", name: "Innovator", description: "Win a competition or hackathon", icon: "💡", points_required: 0, category: "achievement" },
  { id: "6", name: "Point Collector", description: "Earn 1000 points", icon: "💎", points_required: 1000, category: "points" },
];

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      return staticAchievements;
    },
  });
}

export function useAchievementsWithStatus() {
  const { user, profile } = useAuth();

  return useQuery({
    queryKey: ["achievements-with-status", user?.id],
    queryFn: async (): Promise<AchievementWithStatus[]> => {
      // Check which achievements are unlocked based on current data
      const unlockedIds: string[] = [];

      // First Steps - unlocked if onboarding is completed
      if (profile?.onboarding_completed) {
        unlockedIds.push("1");
      }

      // For now, return achievements with basic unlock status
      return staticAchievements.map((achievement) => ({
        ...achievement,
        unlocked: unlockedIds.includes(achievement.id),
      }));
    },
    enabled: !!user,
  });
}
