import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Trophy, 
  Calendar, 
  Users, 
  MapPin,
  GraduationCap,
  Edit3,
  Share2,
  Github,
  Linkedin,
  Globe,
  Award,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useLeaderboard";
import { useAchievementsWithStatus } from "@/hooks/useAchievements";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { profile, user } = useAuth();
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { data: achievements, isLoading: achievementsLoading } = useAchievementsWithStatus();

  // Fetch user skills
  const { data: userSkills } = useQuery({
    queryKey: ["user-skills", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_skills")
        .select("skill")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map(s => s.skill);
    },
    enabled: !!user,
  });

  // Fetch recent user points as activity
  const { data: recentActivity } = useQuery({
    queryKey: ["user-activity", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_points")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const unlockedCount = achievements?.filter(a => a.unlocked).length || 0;
  const totalCount = achievements?.length || 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border"
        >
          {/* Banner */}
          <div className="h-32 lg:h-40 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-16 lg:-mt-12">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl lg:text-5xl font-bold text-primary-foreground border-4 border-background shadow-xl">
                  {profile?.full_name?.charAt(0) || "U"}
                </div>
                <div className="lg:pb-2">
                  <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                    {profile?.full_name || "Anonymous User"}
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      {profile?.course || "Student"}
                    </span>
                    {profile?.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {profile.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 lg:mt-0">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-foreground mb-4">Stats Overview</h3>
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-primary">
                      {userStats?.totalPoints?.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {userStats?.rank ? `#${userStats.rank}` : "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">Campus Rank</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {userStats?.eventsCount || "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Events</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {userStats?.teamsCount || "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Teams</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-foreground mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userSkills && userSkills.length > 0 ? (
                  userSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Github className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">GitHub</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Linkedin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">LinkedIn</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Portfolio</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Achievements</h3>
                <span className="text-sm text-muted-foreground">{unlockedCount}/{totalCount} unlocked</span>
              </div>
              {achievementsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {achievements?.map((ach) => (
                    <div
                      key={ach.id}
                      className={cn(
                        "aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-transform hover:scale-105 cursor-pointer",
                        ach.unlocked
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-secondary/50 opacity-40"
                      )}
                      title={`${ach.name}: ${ach.description}`}
                    >
                      <span className="text-2xl mb-1">{ach.icon}</span>
                      <span className="text-[10px] text-center text-muted-foreground leading-tight">
                        {ach.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {activity.source || `Earned points (${activity.category})`}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.created_at)}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">+{activity.points}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity. Start earning points by participating in events!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
