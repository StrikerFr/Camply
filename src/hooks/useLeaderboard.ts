import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface LeaderboardEntry {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  college_id: string | null;
  total_points: number;
  rank: number;
}

export function useLeaderboard(limit: number = 20) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: async () => {
      // Get all profiles (include those who registered, not just onboarded)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, college_id");

      if (profilesError) throw profilesError;

      // Get all points
      const { data: points, error: pointsError } = await supabase
        .from("user_points")
        .select("user_id, points");

      if (pointsError) throw pointsError;

      // Calculate total points per user and rank
      const userPoints = new Map<string, number>();
      points?.forEach((p) => {
        userPoints.set(p.user_id, (userPoints.get(p.user_id) || 0) + p.points);
      });

      const leaderboard: LeaderboardEntry[] = profiles
        ?.map((profile) => ({
          user_id: profile.user_id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          college_id: profile.college_id,
          total_points: userPoints.get(profile.user_id) || 0,
          rank: 0,
        }))
        .filter((entry) => entry.total_points > 0) // Only show users with points
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, limit) || [];

      return leaderboard;
    },
  });
}

export function useUserRank() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-rank", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, college_id");

      if (profilesError) throw profilesError;

      // Get all points
      const { data: points, error: pointsError } = await supabase
        .from("user_points")
        .select("user_id, points");

      if (pointsError) throw pointsError;

      // Calculate total points per user
      const userPoints = new Map<string, number>();
      points?.forEach((p) => {
        userPoints.set(p.user_id, (userPoints.get(p.user_id) || 0) + p.points);
      });

      // Rank all users with points
      const ranked = profiles
        ?.map((profile) => ({
          user_id: profile.user_id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          college_id: profile.college_id,
          total_points: userPoints.get(profile.user_id) || 0,
          rank: 0,
        }))
        .filter((entry) => entry.total_points > 0)
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({ ...entry, rank: index + 1 })) || [];

      // Find current user or return their default state
      const userEntry = ranked.find((e) => e.user_id === user.id);
      
      if (userEntry) {
        return userEntry;
      }

      // User has no points yet, return unranked state
      const userProfile = profiles?.find((p) => p.user_id === user.id);
      return {
        user_id: user.id,
        full_name: userProfile?.full_name || null,
        avatar_url: userProfile?.avatar_url || null,
        college_id: userProfile?.college_id || null,
        total_points: 0,
        rank: 0,
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

      // Get total points
      const { data: pointsData, error: pointsError } = await supabase
        .from("user_points")
        .select("points, created_at")
        .eq("user_id", user.id);

      if (pointsError) throw pointsError;

      const totalPoints = pointsData?.reduce((sum, p) => sum + p.points, 0) || 0;

      // Get registered events count
      const { count: eventsCount, error: eventsError } = await supabase
        .from("user_opportunities")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (eventsError) throw eventsError;

      // Get all profiles for rank calculation
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id");

      const { data: allPoints } = await supabase
        .from("user_points")
        .select("user_id, points");

      // Calculate rank - only rank users with points
      const userPointsMap = new Map<string, number>();
      allPoints?.forEach((p) => {
        userPointsMap.set(p.user_id, (userPointsMap.get(p.user_id) || 0) + p.points);
      });

      const sortedUsers = profiles
        ?.map((p) => ({
          user_id: p.user_id,
          points: userPointsMap.get(p.user_id) || 0,
        }))
        .filter((u) => u.points > 0)
        .sort((a, b) => b.points - a.points) || [];

      const rank = sortedUsers.findIndex((u) => u.user_id === user.id) + 1 || null;

      // Get points earned this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyPoints = pointsData
        ?.filter((p) => new Date(p.created_at) >= weekAgo)
        .reduce((sum, p) => sum + p.points, 0) || 0;

      return {
        totalPoints,
        eventsCount: eventsCount || 0,
        teamsCount: 0, // Teams table doesn't exist yet
        rank: totalPoints > 0 ? rank : null, // Only show rank if user has points
        weeklyPoints,
      };
    },
    enabled: !!user,
  });
}
