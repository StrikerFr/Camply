import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export interface LeaderboardEntry {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  college_id: string | null;
  total_points: number;
  rank: number;
}

// Mock data until database tables are created
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { user_id: "1", full_name: "Arjun Sharma", avatar_url: null, college_id: "UNIV001", total_points: 4520, rank: 1 },
  { user_id: "2", full_name: "Priya Patel", avatar_url: null, college_id: "UNIV001", total_points: 3890, rank: 2 },
  { user_id: "3", full_name: "Rahul Kumar", avatar_url: null, college_id: "UNIV002", total_points: 3450, rank: 3 },
  { user_id: "4", full_name: "Maya Singh", avatar_url: null, college_id: "UNIV001", total_points: 3120, rank: 4 },
  { user_id: "5", full_name: "Vikram Reddy", avatar_url: null, college_id: "UNIV003", total_points: 2890, rank: 5 },
  { user_id: "6", full_name: "Ananya Gupta", avatar_url: null, college_id: "UNIV002", total_points: 2650, rank: 6 },
  { user_id: "7", full_name: "Karthik Iyer", avatar_url: null, college_id: "UNIV001", total_points: 2400, rank: 7 },
  { user_id: "8", full_name: "Sneha Nair", avatar_url: null, college_id: "UNIV003", total_points: 2150, rank: 8 },
];

export function useLeaderboard(limit: number = 20) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: async () => {
      // Return mock data until database is set up
      return MOCK_LEADERBOARD.slice(0, limit);
    },
  });
}

export function useUserRank() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-rank", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Return mock user rank
      return {
        user_id: user.id,
        full_name: "You",
        avatar_url: null,
        college_id: "UNIV001",
        total_points: 2450,
        rank: 5,
      };
    },
    enabled: !!user,
  });
}

export function useUserStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Return mock stats until database is set up
      return {
        totalPoints: 2450,
        eventsCount: 12,
        teamsCount: 3,
        rank: 5,
        weeklyPoints: 198,
      };
    },
    enabled: !!user,
  });
}
