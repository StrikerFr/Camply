import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Trophy, 
  Calendar, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Clock,
  MapPin,
  Zap,
  Target,
  ArrowUp,
  Check
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
  { rank: 3, name: "Rahul Kumar", points: 3450, avatar: "R" }
];

const FAKE_ACHIEVEMENTS = [
  { id: "1", name: "First Event", icon: "🎯", unlocked: true },
  { id: "2", name: "Team Player", icon: "🤝", unlocked: true },
  { id: "3", name: "Point Master", icon: "⚡", unlocked: true },
  { id: "4", name: "Champion", icon: "🏆", unlocked: false }
];

// Animated number component
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
      className={cn(className, isAnimating && "text-green-500")}
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
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
  
  // Live updating stats
  const [liveStats, setLiveStats] = useState({
    totalPoints: 2450,
    weeklyPoints: 180,
    eventsCount: 12,
    teamsCount: 3,
    rank: 5
  });
  
  const [leaderboard, setLeaderboard] = useState(FAKE_LEADERBOARD_INITIAL);
  const [recentChange, setRecentChange] = useState<{ stat: string; amount: number } | null>(null);
  
  // Periodically update stats to simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      
      if (rand < 0.4) {
        // Increase points (40% chance)
        const increase = Math.floor(Math.random() * 50) + 10;
        setLiveStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + increase,
          weeklyPoints: prev.weeklyPoints + increase
        }));
        setRecentChange({ stat: "points", amount: increase });
      } else if (rand < 0.55) {
        // Increase events (15% chance)
        setLiveStats(prev => ({
          ...prev,
          eventsCount: prev.eventsCount + 1
        }));
        setRecentChange({ stat: "events", amount: 1 });
      } else if (rand < 0.65) {
        // Increase team members (10% chance)
        setLiveStats(prev => ({
          ...prev,
          teamsCount: prev.teamsCount + 1
        }));
        setRecentChange({ stat: "teams", amount: 1 });
      } else if (rand < 0.75) {
        // Improve rank (10% chance, if not already #1)
        setLiveStats(prev => ({
          ...prev,
          rank: Math.max(1, prev.rank - 1)
        }));
        setRecentChange({ stat: "rank", amount: -1 });
      } else {
        // Update leaderboard points
        setLeaderboard(prev => prev.map(user => ({
          ...user,
          points: user.points + Math.floor(Math.random() * 100)
        })));
      }
      
      // Clear change indicator after 2 seconds
      setTimeout(() => setRecentChange(null), 2000);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      label: "Points Earned", 
      value: liveStats.totalPoints,
      displayValue: liveStats.totalPoints.toLocaleString(), 
      icon: Trophy, 
      change: `+${liveStats.weeklyPoints} this week`, 
      color: "text-amber-500",
      isChanging: recentChange?.stat === "points"
    },
    { 
      label: "Events Joined", 
      value: liveStats.eventsCount,
      displayValue: liveStats.eventsCount.toString(), 
      icon: Calendar, 
      change: "View all", 
      color: "text-primary",
      isChanging: recentChange?.stat === "events"
    },
    { 
      label: "Team Members", 
      value: liveStats.teamsCount,
      displayValue: liveStats.teamsCount.toString(), 
      icon: Users, 
      change: "Find teammates", 
      color: "text-emerald-500",
      isChanging: recentChange?.stat === "teams"
    },
    { 
      label: "Rank", 
      value: liveStats.rank,
      displayValue: `#${liveStats.rank}`, 
      icon: TrendingUp, 
      change: "View leaderboard", 
      color: "text-primary",
      isChanging: recentChange?.stat === "rank"
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-card border border-border p-5 lg:p-6"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-primary mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">Welcome back</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1.5">
              Hey, {firstName}! 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              You're on fire! You've earned {liveStats.weeklyPoints} points this week.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const statRoutes: Record<string, string> = {
              "Points Earned": "/leaderboard",
              "Events Joined": "/opportunities",
              "Team Members": "/teams",
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
                  "bg-card border rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all group relative overflow-hidden cursor-pointer",
                  stat.isChanging ? "border-green-500/50" : "border-border"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Flash overlay when changing */}
                <AnimatePresence>
                  {stat.isChanging && (
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 bg-green-500/20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
                
                <div className="flex items-center justify-between mb-2">
                  <motion.div 
                    className={cn("p-1.5 rounded-md bg-secondary/50", stat.color)}
                    animate={stat.isChanging ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className="h-4 w-4" />
                  </motion.div>
                  <AnimatePresence>
                    {stat.isChanging && recentChange && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-0.5 text-green-500 text-xs font-bold"
                      >
                        <ArrowUp className="h-2.5 w-2.5" />
                        +{stat.label === "Rank" ? "1" : recentChange.amount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div 
                  className={cn(
                    "text-xl lg:text-2xl font-display font-bold mb-0.5",
                    stat.isChanging ? "text-green-500" : "text-foreground"
                  )}
                  animate={stat.isChanging ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {stat.label === "Rank" ? stat.displayValue : (
                    <AnimatedNumber value={stat.value} />
                  )}
                </motion.div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-[10px] text-primary mt-1.5 group-hover:underline">
                  {stat.label === "Points Earned" ? `+${liveStats.weeklyPoints} this week` : stat.change}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Recommended Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm text-foreground">Featured Opportunities</h2>
                  <p className="text-xs text-muted-foreground">Don't miss out on these</p>
                </div>
              </div>
              <Link to="/opportunities">
                <Button variant="ghost" size="sm" className="text-primary h-7 text-xs">
                  View All
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-border">
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
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate("/opportunities")}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          {opp.is_featured && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded">
                              Featured
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground border border-border rounded">
                            {opp.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {opp.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
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
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-1 text-primary font-medium text-sm">
                          <Zap className="h-3.5 w-3.5" />
                          {opp.points} pts
                        </div>
                        <Button 
                          size="sm" 
                          className={cn(
                            "mt-2 h-7 px-3 text-xs transition-all duration-200 hover:scale-105 active:scale-95",
                            isRegistered 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
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
            className="space-y-4"
          >
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-1.5">
                <Link to="/opportunities">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-border hover:bg-secondary hover:border-primary/50 text-foreground transition-all duration-200"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
                    Browse Opportunities
                  </Button>
                </Link>
                <Link to="/teams">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-border hover:bg-secondary hover:border-primary/50 text-foreground transition-all duration-200"
                  >
                    <Users className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                    Find Teammates
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-border hover:bg-secondary hover:border-primary/50 text-foreground transition-all duration-200"
                  >
                    <Trophy className="h-3.5 w-3.5 mr-2 text-amber-500" />
                    View Rankings
                  </Button>
                </Link>
              </div>
            </div>

            {/* External Resources */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">External Resources</h3>
              <div className="space-y-1.5">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-border hover:bg-secondary hover:border-primary/50 text-foreground transition-all duration-200"
                  >
                    <span className="mr-2 font-bold text-blue-600">in</span>
                    LinkedIn Jobs
                  </Button>
                </a>
                <a href="https://unstop.com" target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-border hover:bg-secondary hover:border-primary/50 text-foreground transition-all duration-200"
                  >
                    <span className="mr-2">🚀</span>
                    Unstop
                  </Button>
                </a>
                <a href="https://internshala.com" target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-border hover:bg-secondary hover:border-primary/50 text-foreground transition-all duration-200"
                  >
                    <span className="mr-2">💼</span>
                    Internshala
                  </Button>
                </a>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground">Achievements</h3>
                <Link to="/profile" className="text-xs text-primary hover:underline transition-colors">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {FAKE_ACHIEVEMENTS.map((ach) => (
                  <motion.div
                    key={ach.id}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-lg cursor-pointer transition-all",
                      ach.unlocked
                        ? "bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/50"
                        : "bg-secondary/50 opacity-40 hover:opacity-60"
                    )}
                    title={ach.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (ach.unlocked) {
                        toast.success(`${ach.name} Achievement`, {
                          description: "You've unlocked this achievement!",
                        });
                      } else {
                        toast.info(`${ach.name} - Locked`, {
                          description: "Keep participating to unlock this!",
                        });
                      }
                    }}
                  >
                    {ach.icon}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground">Top Performers</h3>
                <Link to="/leaderboard" className="text-xs text-primary hover:underline transition-colors">
                  Full Ranking
                </Link>
              </div>
              <div className="space-y-2">
                {leaderboard.map((user) => (
                  <motion.div 
                    key={user.rank} 
                    className="flex items-center gap-2.5 p-1.5 -mx-1.5 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    layout
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      toast.info(`${user.name}`, {
                        description: `Rank #${user.rank} with ${user.points.toLocaleString()} points`,
                      });
                    }}
                  >
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                      user.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                      user.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                      "bg-orange-500/20 text-orange-500"
                    )}>
                      {user.rank}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">{user.name}</p>
                    </div>
                    <motion.span 
                      key={user.points}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {user.points.toLocaleString()}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
