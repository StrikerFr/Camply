import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  Award,
  Code,
  Palette,
  Briefcase,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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

const categoryIcons: Record<string, React.ReactNode> = {
  Tech: <Code className="h-3 w-3" />,
  Cultural: <Palette className="h-3 w-3" />,
  Management: <Briefcase className="h-3 w-3" />,
};

// Animated count-up on mount
function CountUpNumber({ 
  value, 
  prefix = "", 
  className,
  isAnimating = false 
}: { 
  value: number; 
  prefix?: string;
  className?: string;
  isAnimating?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);
  
  // Initial count-up animation on mount
  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 1200;
      const steps = 40;
      const stepValue = value / steps;
      const stepDuration = duration / steps;
      
      let current = 0;
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        current += stepValue;
        setDisplayValue(Math.round(current));
        
        if (step >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // Update when value changes after initial animation
  useEffect(() => {
    if (hasAnimated.current && value !== displayValue) {
      const duration = 400;
      const steps = 15;
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
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [value]);
  
  return (
    <motion.span
      className={cn(className, isAnimating && "text-emerald-400")}
      animate={isAnimating ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.25 }}
    >
      {prefix}{displayValue.toLocaleString()}
    </motion.span>
  );
}

// Loading skeleton for stats
function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

// Loading skeleton for opportunities
function OpportunityCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-12 rounded" />
          </div>
          <Skeleton className="h-5 w-3/4 mb-3" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const firstName = "Alex";
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [liveStats, setLiveStats] = useState({
    totalPoints: 2450,
    weeklyPoints: 198,
    eventsCount: 12,
    teamsCount: 3,
    rank: 5
  });
  
  const [leaderboard, setLeaderboard] = useState(FAKE_LEADERBOARD_INITIAL);
  const [recentChange, setRecentChange] = useState<{ stat: string; amount: number } | null>(null);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
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
    }, 4000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
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
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight leading-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">
              Here's what's happening with your campus journey
            </p>
          </div>
          <Link to="/opportunities">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                Browse Opportunities
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 lg:gap-5">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            stats.map((stat, index) => {
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
                  transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                  onClick={() => navigate(statRoutes[stat.label] || "/dashboard")}
                  className={cn(
                    "relative bg-card border rounded-xl p-5 cursor-pointer group overflow-hidden transition-all duration-300",
                    stat.isChanging 
                      ? "border-emerald-500/40 shadow-lg shadow-emerald-500/10" 
                      : "border-border hover:border-border/60 hover:shadow-lg hover:shadow-black/20"
                  )}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  
                  <AnimatePresence>
                    {stat.isChanging && (
                      <motion.div
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 bg-emerald-500/10 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-lg transition-all duration-300 bg-muted group-hover:bg-accent">
                        <stat.icon className="h-4 w-4 transition-colors duration-300 text-muted-foreground group-hover:text-foreground" />
                      </div>
                      <AnimatePresence>
                        {stat.isChanging && recentChange && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.8 }}
                            className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-1 rounded-full"
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
                      {stat.isRank ? (
                        <CountUpNumber value={stat.value} prefix="#" isAnimating={stat.isChanging} />
                      ) : (
                        <CountUpNumber value={stat.value} isAnimating={stat.isChanging} />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                      <span className="text-xs font-medium text-muted-foreground/60">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Featured Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="lg:col-span-2"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground text-lg tracking-tight">Featured Opportunities</h2>
                  <p className="text-sm text-muted-foreground">Don't miss out</p>
                </div>
              </div>
              <Link to="/opportunities">
                <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground group">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <>
                  <OpportunityCardSkeleton />
                  <OpportunityCardSkeleton />
                  <OpportunityCardSkeleton />
                </>
              ) : (
                FAKE_OPPORTUNITIES.map((opp, index) => {
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
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
                      className="bg-card border border-border rounded-xl p-5 hover:border-border/60 hover:shadow-lg hover:shadow-black/10 transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate("/opportunities")}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            {opp.is_featured && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-primary/10 text-primary rounded-md">
                                <Star className="h-3 w-3" />
                                Featured
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-muted text-muted-foreground rounded-md">
                              {categoryIcons[opp.category]}
                              {opp.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground text-base group-hover:text-foreground/80 transition-colors truncate leading-snug">
                            {opp.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              {opp.registration_deadline}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {opp.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-1.5 text-sm font-semibold">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span className="text-foreground">{opp.points}</span>
                            <span className="text-muted-foreground font-normal">pts</span>
                          </div>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button 
                              size="sm" 
                              className={cn(
                                "h-9 px-5 text-sm font-medium transition-all duration-300",
                                isRegistered 
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20" 
                                  : "bg-foreground text-background hover:bg-foreground/90 shadow-md hover:shadow-lg"
                              )}
                              onClick={handleRegister}
                            >
                              {isRegistered ? (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1.5" />
                                  Registered
                                </>
                              ) : (
                                "Register"
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Leaderboard Preview */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">Leaderboard</span>
                </div>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="divide-y divide-border/60">
                {leaderboard.slice(0, 5).map((user, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3.5 transition-all duration-200",
                      user.isUser && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    {/* Rank Badge */}
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      user.rank === 1 && "bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-md shadow-amber-500/30",
                      user.rank === 2 && "bg-gradient-to-br from-zinc-300 to-zinc-500 text-black shadow-md shadow-zinc-400/30",
                      user.rank === 3 && "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md shadow-amber-700/30",
                      user.rank > 3 && "bg-muted text-muted-foreground"
                    )}>
                      {user.rank}
                    </div>
                    
                    {/* Avatar */}
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      user.isUser 
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/30" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {user.avatar}
                    </div>
                    
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        user.isUser ? "text-primary" : "text-foreground"
                      )}>
                        {user.name}
                      </p>
                    </div>
                    
                    {/* Points */}
                    <span className={cn(
                      "text-sm font-semibold tabular-nums",
                      user.isUser ? "text-primary" : "text-muted-foreground"
                    )}>
                      {user.points.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">Achievements</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                  {FAKE_ACHIEVEMENTS.filter(a => a.unlocked).length}/{FAKE_ACHIEVEMENTS.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {FAKE_ACHIEVEMENTS.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={achievement.unlocked ? { scale: 1.08, y: -2 } : {}}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-200 cursor-default",
                      achievement.unlocked 
                        ? "bg-muted hover:bg-accent hover:shadow-md" 
                        : "bg-muted/40 opacity-40 grayscale"
                    )}
                    title={achievement.name}
                  >
                    {achievement.icon}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Quick Actions</h3>
              </div>
              <div className="space-y-2.5">
                <Link to="/teams" className="block">
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start h-10 text-sm border-border hover:bg-muted hover:border-border/60 text-foreground transition-all duration-200"
                    >
                      <Users className="h-4 w-4 mr-2.5 text-muted-foreground" />
                      Find Teammates
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/profile" className="block">
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start h-10 text-sm border-border hover:bg-muted hover:border-border/60 text-foreground transition-all duration-200"
                    >
                      <Award className="h-4 w-4 mr-2.5 text-muted-foreground" />
                      View Profile
                    </Button>
                  </motion.div>
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
