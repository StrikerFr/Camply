import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

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

// Mock teammates data
const MOCK_TEAMMATES: Teammate[] = [
  { user_id: "1", full_name: "Arjun Sharma", avatar_url: null, skills: ["JavaScript", "React", "Node.js"], totalPoints: 4520 },
  { user_id: "2", full_name: "Priya Patel", avatar_url: null, skills: ["Python", "Machine Learning", "Data Science"], totalPoints: 3890 },
  { user_id: "3", full_name: "Rahul Kumar", avatar_url: null, skills: ["UI/UX Design", "Figma", "Adobe XD"], totalPoints: 3450 },
  { user_id: "4", full_name: "Maya Singh", avatar_url: null, skills: ["Marketing", "Content Writing", "SEO"], totalPoints: 3120 },
  { user_id: "5", full_name: "Vikram Reddy", avatar_url: null, skills: ["Java", "Spring Boot", "AWS"], totalPoints: 2890 },
  { user_id: "6", full_name: "Ananya Gupta", avatar_url: null, skills: ["Flutter", "Dart", "Firebase"], totalPoints: 2650 },
];

export function useMyTeams() {
  const { user } = useAuth();

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
      // Return mock teammates until database is set up
      return MOCK_TEAMMATES;
    },
    enabled: !!user,
  });
}
