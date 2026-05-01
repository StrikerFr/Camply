import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string | null;
  location: string | null;
  points: number;
  is_featured: boolean;
  registration_deadline: string | null;
  max_participants: number | null;
  image_url: string | null;
  created_at: string;
}

// Mock opportunities data
const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Hackathon 2026 - Code for Change",
    description: "Join the biggest coding event of the year! Build innovative solutions to real-world problems.",
    category: "Tech",
    date: "2026-01-20",
    location: "Main Campus",
    points: 500,
    is_featured: true,
    registration_deadline: "2026-01-15",
    max_participants: 100,
    image_url: null,
    created_at: "2025-12-01",
  },
  {
    id: "2",
    title: "Leadership Summit",
    description: "Develop your leadership skills with industry experts.",
    category: "Management",
    date: "2026-01-25",
    location: "Conference Hall",
    points: 300,
    is_featured: true,
    registration_deadline: "2026-01-20",
    max_participants: 50,
    image_url: null,
    created_at: "2025-12-01",
  },
  {
    id: "3",
    title: "Cultural Fest - Euphoria",
    description: "Celebrate diversity and showcase your talents!",
    category: "Cultural",
    date: "2026-02-05",
    location: "Open Auditorium",
    points: 250,
    is_featured: false,
    registration_deadline: "2026-02-01",
    max_participants: 200,
    image_url: null,
    created_at: "2025-12-01",
  },
  {
    id: "4",
    title: "Design Sprint Challenge",
    description: "48 hours to design innovative solutions.",
    category: "Design",
    date: "2026-01-28",
    location: "Innovation Hub",
    points: 400,
    is_featured: true,
    registration_deadline: "2026-01-25",
    max_participants: 40,
    image_url: null,
    created_at: "2025-12-01",
  },
  {
    id: "5",
    title: "AI/ML Workshop",
    description: "Learn the fundamentals of AI and Machine Learning.",
    category: "Tech",
    date: "2026-02-01",
    location: "Tech Block",
    points: 350,
    is_featured: true,
    registration_deadline: "2026-01-30",
    max_participants: 60,
    image_url: null,
    created_at: "2025-12-01",
  },
];

export function useOpportunities() {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      // Return mock data until database is set up
      return MOCK_OPPORTUNITIES;
    },
  });
}

export function useUserOpportunities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-opportunities", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Return empty array until database is set up
      return [];
    },
    enabled: !!user,
  });
}

export function useRegisterForOpportunity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (opportunityId: string) => {
      if (!user) throw new Error("Must be logged in");
      
      // Mock registration - in real implementation this would save to database
      console.log("Registering for opportunity:", opportunityId);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
      toast.success("Successfully registered!", {
        description: "You earned 10 points for registering.",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register");
    },
  });
}

export function useFeaturedOpportunities() {
  return useQuery({
    queryKey: ["featured-opportunities"],
    queryFn: async () => {
      // Return featured mock opportunities
      return MOCK_OPPORTUNITIES.filter(o => o.is_featured).slice(0, 3);
    },
  });
}
