import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Loader2,
  Settings,
  LogOut,
  Bell,
  Shield,
  Eye,
  Palette,
  Moon,
  Sun,
  User,
  Lock,
  Mail,
  Trash2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Fake data for display
const FAKE_STATS = {
  totalPoints: 2450,
  rank: 12,
  eventsCount: 8,
  teamsCount: 3
};

const FAKE_SKILLS = ["React", "TypeScript", "Python", "UI/UX Design", "Node.js", "Machine Learning"];

const FAKE_ACHIEVEMENTS = [
  { id: "1", name: "First Steps", icon: "🚀", unlocked: true, description: "Complete your first event", progress: 100, current: 1, target: 1 },
  { id: "2", name: "Team Player", icon: "👥", unlocked: true, description: "Join your first team", progress: 100, current: 3, target: 1 },
  { id: "3", name: "Rising Star", icon: "⭐", unlocked: true, description: "Reach 1000 points", progress: 100, current: 2450, target: 1000 },
  { id: "4", name: "Hackathon Hero", icon: "💻", unlocked: true, description: "Win a hackathon", progress: 100, current: 1, target: 1 },
  { id: "5", name: "Networker", icon: "🤝", unlocked: false, description: "Connect with 50 people", progress: 68, current: 34, target: 50 },
  { id: "6", name: "Legend", icon: "👑", unlocked: false, description: "Reach top 10 on leaderboard", progress: 20, current: 12, target: 10 },
];

const FAKE_ACTIVITY = [
  { id: "1", source: "Won 2nd place in AI Hackathon", points: 500, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", source: "Completed Machine Learning Workshop", points: 100, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", source: "Team collaboration bonus", points: 50, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "4", source: "Participated in Design Sprint", points: 150, created_at: new Date(Date.now() - 259200000).toISOString() },
];

const Profile = () => {
  const { profile, user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "account">("profile");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const unlockedCount = FAKE_ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalCount = FAKE_ACHIEVEMENTS.length;

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "settings" as const, label: "Settings", icon: Settings },
    { id: "account" as const, label: "Account", icon: Shield },
  ];

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
                  {profile?.full_name?.charAt(0) || "A"}
                </div>
                <div className="lg:pb-2">
                  <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                    {profile?.full_name || "Alex Johnson"}
                  </h1>
                  <p className="text-muted-foreground">{user?.email || "alex.johnson@university.edu"}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      {profile?.course || "Computer Science"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {profile?.year || "3rd Year"}
                    </span>
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

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 border-b border-border"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        {activeTab === "profile" && (
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-primary">
                      {FAKE_STATS.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-foreground">
                      #{FAKE_STATS.rank}
                    </div>
                    <div className="text-xs text-muted-foreground">Campus Rank</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {FAKE_STATS.eventsCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Events</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {FAKE_STATS.teamsCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Teams</div>
                  </div>
                </div>
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
                  {FAKE_SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
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
                    <span className="text-sm text-foreground">github.com/alexjohnson</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">linkedin.com/in/alexjohnson</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">alexjohnson.dev</span>
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
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Achievements</h3>
                    <p className="text-sm text-muted-foreground">Your journey milestones</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{unlockedCount}/{totalCount}</span>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="relative">
                  {/* Timeline connector line */}
                  <div className="absolute top-8 left-0 right-0 h-1 bg-border rounded-full hidden sm:block">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    />
                  </div>

                  {/* Achievement Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {FAKE_ACHIEVEMENTS.map((ach, index) => (
                      <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className={cn(
                          "relative flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 group",
                          ach.unlocked
                            ? "bg-gradient-to-b from-primary/15 to-primary/5 border border-primary/30 shadow-lg shadow-primary/10"
                            : "bg-secondary/30 border border-border"
                        )}
                      >
                        {/* Step number */}
                        <div className={cn(
                          "absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                          ach.unlocked 
                            ? "bg-primary text-primary-foreground border-background" 
                            : "bg-muted text-muted-foreground border-background"
                        )}>
                          {index + 1}
                        </div>

                        {/* Icon container */}
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110",
                          ach.unlocked 
                            ? "bg-primary/20 shadow-inner" 
                            : "bg-muted/50"
                        )}>
                          <span className={cn(
                            "text-3xl transition-all duration-300",
                            !ach.unlocked && "grayscale opacity-50"
                          )}>
                            {ach.icon}
                          </span>
                        </div>

                        {/* Name */}
                        <span className={cn(
                          "text-xs font-medium text-center leading-tight mb-2",
                          ach.unlocked ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {ach.name}
                        </span>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ach.progress}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                            className={cn(
                              "h-full rounded-full",
                              ach.unlocked 
                                ? "bg-gradient-to-r from-primary to-primary/80" 
                                : "bg-muted-foreground/50"
                            )}
                          />
                        </div>

                        {/* Progress text */}
                        <span className={cn(
                          "text-[10px] mt-1.5",
                          ach.unlocked ? "text-primary" : "text-muted-foreground"
                        )}>
                          {ach.unlocked ? "Completed ✓" : `${ach.current}/${ach.target}`}
                        </span>

                        {/* Glow effect on hover */}
                        {ach.unlocked && (
                          <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Next Achievement Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Next: Networker</p>
                    <p className="text-xs text-muted-foreground">Connect with 16 more people to unlock</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">68%</span>
                  </div>
                </motion.div>
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
                  {FAKE_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.source}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.created_at)}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">+{activity.points}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Appearance */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Appearance</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    theme === "dark" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <Moon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Night Mode</p>
                    <p className="text-sm text-muted-foreground">Dark theme</p>
                  </div>
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    theme === "light" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <Sun className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Day Mode</p>
                    <p className="text-sm text-muted-foreground">Light theme</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications about new events</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Email Updates</p>
                    <p className="text-sm text-muted-foreground">Get weekly digest of opportunities</p>
                  </div>
                  <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Privacy</h3>
                  <p className="text-sm text-muted-foreground">Control your profile visibility</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">Profile Visibility</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">Public</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">Show on Leaderboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">Yes</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "account" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Account Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Account Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your account details</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <span className="text-foreground block">Email Address</span>
                      <span className="text-sm text-muted-foreground">{user?.email || "alex.johnson@university.edu"}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <span className="text-foreground block">Password</span>
                      <span className="text-sm text-muted-foreground">••••••••</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="bg-card border border-border rounded-xl p-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-primary/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-primary" />
                  <span className="text-primary font-medium">Sign Out</span>
                </div>
                <ChevronRight className="h-4 w-4 text-primary" />
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-card border border-destructive/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Irreversible actions</p>
                </div>
              </div>
              <button 
                onClick={() => toast.error("This action is disabled for demo purposes")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-destructive">Delete Account</span>
                </div>
                <ChevronRight className="h-4 w-4 text-destructive" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;