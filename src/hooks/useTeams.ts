import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Since teams and achievements tables don't exist yet, we'll use mock data
// that can be replaced with real data once the tables are created

export interface Team {
  id: string;
  name: string;
  description: string | null;
  leader_id: string;
  opportunity_id: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
  opportunity?: {
    title: string;
  } | null;
}

export interface Teammate {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  skills: string[];
  totalPoints: number;
}

export function useMyTeams() {
  const { user } = useAuth();

  // Teams table doesn't exist yet - return empty for now
  // This will work once the migration is applied
  return useQuery({
    queryKey: ["my-teams", user?.id],
    queryFn: async (): Promise<TeamWithMembers[]> => {
      // Return empty array until teams table is created
      return [];
    },
    enabled: !!user,
  });
}

export function useFindTeammates() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["find-teammates"],
    queryFn: async (): Promise<Teammate[]> => {
      if (!user) return [];

      // Get profiles with onboarding completed, excluding current user
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .eq("onboarding_completed", true)
        .neq("user_id", user.id)
        .limit(20);

      if (profilesError) throw profilesError;
      if (!profiles || profiles.length === 0) return [];

      const userIds = profiles.map((p) => p.user_id);

      // Get skills for each user
      const { data: skills, error: skillsError } = await supabase
        .from("user_skills")
        .select("user_id, skill")
        .in("user_id", userIds);

      if (skillsError) throw skillsError;

      // Get points for each user
      const { data: points, error: pointsError } = await supabase
        .from("user_points")
        .select("user_id, points")
        .in("user_id", userIds);

      if (pointsError) throw pointsError;

      // Combine data
      return profiles.map((profile) => ({
        user_id: profile.user_id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        skills: skills?.filter((s) => s.user_id === profile.user_id).map((s) => s.skill) || [],
        totalPoints: points?.filter((p) => p.user_id === profile.user_id).reduce((sum, p) => sum + p.points, 0) || 0,
      }));
    },
    enabled: !!user,
  });
}
