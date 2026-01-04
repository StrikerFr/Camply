import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Trophy, 
  Calendar, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Clock,
  MapPin,
  Zap,
  Target,
  ArrowUp,
  Check,
  ChevronRight,
  Star,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FAKE_OPPORTUNITIES = [
  {
    id: "1",
    title: "Hackathon 2026 - Code for Change",
    category: "Tech",
    is_featured: true,
    registration_deadline: "Jan 15, 2026",
    location: "Main Campus",
    points: 500
  },
  {
    id: "2",
    title: "Leadership Summit",
    category: "Management",
    is_featured: true,
    registration_deadline: "Jan 20, 2026",
    location: "Conference Hall",
    points: 300
  },
  {
    id: "3",
    title: "Cultural Fest - Euphoria",
    category: "Cultural",
    is_featured: false,
    registration_deadline: "Feb 1, 2026",
    location: "Open Auditorium",
    points: 250
  }
];

const FAKE_LEADERBOARD_INITIAL = [
  { rank: 1, name: "Arjun Sharma", points: 4520, avatar: "A" },
  { rank: 2, name: "Priya Patel", points: 3890, avatar: "P" },
  { rank: 3, name: "Rahul Kumar", points: 3450, avatar: "R" },
  { rank: 4, name: "Maya Singh", points: 3120, avatar: "M" },
  { rank: 5, name: "You", points: 2450, avatar: "Y", isUser: true }
];

const FAKE_ACHIEVEMENTS = [
  { id: "1", name: "First Event", icon: "🎯", unlocked: true },
  { id: "2", name: "Team Player", icon: "🤝", unlocked: true },
  { id: "3", name: "Point Master", icon: "⚡", unlocked: true },
  { id: "4", name: "Champion", icon: "🏆", unlocked: false }
];

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const duration = 500;
      const steps = 20;
      const stepValue = (value - displayValue) / steps;
      const stepDuration = duration / steps;
      
      let current = displayValue;
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        current += stepValue;
        setDisplayValue(Math.round(current));
        
        if (step >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
          setTimeout(() => setIsAnimating(false), 300);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [value, displayValue]);
  
  return (
    <motion.span
      className={cn(className, isAnimating && "text-emerald-400")}
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const firstName = "Alex";
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  
  const [liveStats, setLiveStats] = useState({
    totalPoints: 2450,
    weeklyPoints: 180,
    eventsCount: 12,
    teamsCount: 3,
    rank: 5
  });
  
  const [leaderboard, setLeaderboard] = useState(FAKE_LEADERBOARD_INITIAL);
  const [recentChange, setRecentChange] = useState<{ stat: string; amount: number } | null>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      
      if (rand < 0.4) {
        const increase = Math.floor(Math.random() * 50) + 10;
        setLiveStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + increase,
          weeklyPoints: prev.weeklyPoints + increase
        }));
        setRecentChange({ stat: "points", amount: increase });
      } else if (rand < 0.55) {
        setLiveStats(prev => ({
          ...prev,
          eventsCount: prev.eventsCount + 1
        }));
        setRecentChange({ stat: "events", amount: 1 });
      } else if (rand < 0.65) {
        setLiveStats(prev => ({
          ...prev,
          teamsCount: prev.teamsCount + 1
        }));
        setRecentChange({ stat: "teams", amount: 1 });
      } else if (rand < 0.75) {
        setLiveStats(prev => ({
          ...prev,
          rank: Math.max(1, prev.rank - 1)
        }));
        setRecentChange({ stat: "rank", amount: -1 });
      } else {
        setLeaderboard(prev => prev.map(user => ({
          ...user,
          points: user.points + Math.floor(Math.random() * 100)
        })));
      }
      
      setTimeout(() => setRecentChange(null), 2000);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      label: "Total Points", 
      value: liveStats.totalPoints,
      icon: Trophy, 
      change: `+${liveStats.weeklyPoints} this week`,
      isChanging: recentChange?.stat === "points"
    },
    { 
      label: "Events", 
      value: liveStats.eventsCount,
      icon: Calendar, 
      change: "Joined", 
      isChanging: recentChange?.stat === "events"
    },
    { 
      label: "Teams", 
      value: liveStats.teamsCount,
      icon: Users, 
      change: "Active", 
      isChanging: recentChange?.stat === "teams"
    },
    { 
      label: "Rank", 
      value: liveStats.rank,
      icon: TrendingUp, 
      change: "Global", 
      isRank: true,
      isChanging: recentChange?.stat === "rank"
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your campus journey
            </p>
          </div>
          <Link to="/opportunities">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Browse Opportunities
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const statRoutes: Record<string, string> = {
              "Total Points": "/leaderboard",
              "Events": "/opportunities",
              "Teams": "/teams",
              "Rank": "/leaderboard"
            };
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(statRoutes[stat.label] || "/dashboard")}
                className={cn(
                  "relative bg-card border rounded-lg p-5 cursor-pointer group overflow-hidden transition-all duration-300",
                  stat.isChanging ? "border-emerald-500/50" : "border-border hover:border-border/80"
                )}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence>
                  {stat.isChanging && (
                    <motion.div
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 bg-emerald-500/10 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
                
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    "bg-muted group-hover:bg-accent"
                  )}>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <AnimatePresence>
                    {stat.isChanging && recentChange && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold"
                      >
                        <ArrowUp className="h-3 w-3" />
                        +{stat.label === "Rank" ? "1" : recentChange.amount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className={cn(
                  "text-2xl lg:text-3xl font-display font-bold tracking-tight",
                  stat.isChanging ? "text-emerald-400" : "text-foreground"
                )}>
                  {stat.isRank ? `#${stat.value}` : (
                    <AnimatedNumber value={stat.value} />
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="text-xs text-muted-foreground/70">{stat.change}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Featured Opportunities</h2>
                  <p className="text-xs text-muted-foreground">Don't miss out</p>
                </div>
              </div>
              <Link to="/opportunities">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {FAKE_OPPORTUNITIES.map((opp) => {
                const isRegistered = registeredEvents.includes(opp.id);
                
                const handleRegister = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (isRegistered) {
                    setRegisteredEvents(prev => prev.filter(id => id !== opp.id));
                    toast.info(`Unregistered from ${opp.title}`);
                  } else {
                    setRegisteredEvents(prev => [...prev, opp.id]);
                    setLiveStats(prev => ({
                      ...prev,
                      eventsCount: prev.eventsCount + 1,
                      totalPoints: prev.totalPoints + opp.points
                    }));
                    toast.success(`Registered for ${opp.title}!`, {
                      description: `You earned ${opp.points} points!`,
                    });
                  }
                };
                
                return (
                  <motion.div
                    key={opp.id}
                    className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-all cursor-pointer group"
                    onClick={() => navigate("/opportunities")}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {opp.is_featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">
                              <Star className="h-3 w-3" />
                              Featured
                            </span>
                          )}
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded">
                            {opp.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors truncate">
                          {opp.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {opp.registration_deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {opp.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                          {opp.points} pts
                        </div>
                        <Button 
                          size="sm" 
                          className={cn(
                            "h-8 px-4 text-xs transition-all",
                            isRegistered 
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                              : "bg-foreground text-background hover:bg-foreground/90"
                          )}
                          onClick={handleRegister}
                        >
                          {isRegistered ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Registered
                            </>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Leaderboard Preview */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Leaderboard</span>
                </div>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="divide-y divide-border">
                {leaderboard.slice(0, 5).map((user, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-3 transition-colors",
                      user.isUser && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      user.rank === 1 ? "bg-amber-500/20 text-amber-500" :
                      user.rank === 2 ? "bg-zinc-400/20 text-zinc-400" :
                      user.rank === 3 ? "bg-amber-700/20 text-amber-700" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {user.rank}
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                      user.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        user.isUser ? "text-primary" : "text-foreground"
                      )}>
                        {user.name}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Achievements</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {FAKE_ACHIEVEMENTS.filter(a => a.unlocked).length}/{FAKE_ACHIEVEMENTS.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {FAKE_ACHIEVEMENTS.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-xl transition-all",
                      achievement.unlocked 
                        ? "bg-muted" 
                        : "bg-muted/50 opacity-40 grayscale"
                    )}
                    title={achievement.name}
                  >
                    {achievement.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/teams" className="block">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-9 text-sm border-border hover:bg-muted text-foreground"
                  >
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    Find Teammates
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-9 text-sm border-border hover:bg-muted text-foreground"
                  >
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
