import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export type Opportunity = Tables<"opportunities">;

export function useOpportunities() {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

export function useUserOpportunities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-opportunities", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_opportunities")
        .select("*, opportunity:opportunities(*)")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
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

      // Register for opportunity
      const { error: regError } = await supabase
        .from("user_opportunities")
        .insert({
          opportunity_id: opportunityId,
          user_id: user.id,
          status: "registered",
        });

      if (regError) throw regError;

      // Award points for registering
      const { error: pointsError } = await supabase
        .from("user_points")
        .insert({
          user_id: user.id,
          points: 10,
          category: "participation",
          source: "Registered for opportunity",
          opportunity_id: opportunityId,
        });

      if (pointsError) console.error("Failed to award points:", pointsError);

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
      toast.success("Successfully registered!", {
        description: "You earned 10 points for registering.",
      });
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("Already registered for this opportunity");
      } else {
        toast.error("Failed to register");
      }
    },
  });
}

export function useFeaturedOpportunities() {
  return useQuery({
    queryKey: ["featured-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("is_featured", true)
        .order("date", { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });
}
