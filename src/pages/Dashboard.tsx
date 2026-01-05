import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Trophy, Calendar, Users, TrendingUp, ArrowRight, Clock, MapPin, Zap, Target, ArrowUp, Check, ChevronRight, Star, Award, Code, Palette, Briefcase, Sparkles, MessageSquare, Bot, Send, ChevronLeft, SlidersHorizontal, Mic, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
const FAKE_OPPORTUNITIES = [{
  id: "1",
  title: "Hackathon 2026 - Code for Change",
  category: "Tech",
  is_featured: true,
  registration_deadline: "Jan 15, 2026",
  location: "Main Campus",
  points: 500
}, {
  id: "2",
  title: "Leadership Summit",
  category: "Management",
  is_featured: true,
  registration_deadline: "Jan 20, 2026",
  location: "Conference Hall",
  points: 300
}, {
  id: "3",
  title: "Cultural Fest - Euphoria",
  category: "Cultural",
  is_featured: false,
  registration_deadline: "Feb 1, 2026",
  location: "Open Auditorium",
  points: 250
}, {
  id: "4",
  title: "Design Sprint Challenge",
  category: "Design",
  is_featured: true,
  registration_deadline: "Jan 25, 2026",
  location: "Innovation Hub",
  points: 400
}, {
  id: "5",
  title: "Startup Pitch Competition",
  category: "Business",
  is_featured: false,
  registration_deadline: "Feb 5, 2026",
  location: "Auditorium A",
  points: 450
}, {
  id: "6",
  title: "AI/ML Workshop",
  category: "Tech",
  is_featured: true,
  registration_deadline: "Jan 30, 2026",
  location: "Tech Block",
  points: 350
}, {
  id: "7",
  title: "Photography Exhibition",
  category: "Cultural",
  is_featured: false,
  registration_deadline: "Feb 10, 2026",
  location: "Art Gallery",
  points: 200
}, {
  id: "8",
  title: "Public Speaking Workshop",
  category: "Management",
  is_featured: false,
  registration_deadline: "Feb 8, 2026",
  location: "Seminar Hall",
  points: 280
}, {
  id: "9",
  title: "Robotics Championship",
  category: "Tech",
  is_featured: true,
  registration_deadline: "Feb 15, 2026",
  location: "Engineering Block",
  points: 550
}, {
  id: "10",
  title: "Music Fest - Harmony",
  category: "Cultural",
  is_featured: false,
  registration_deadline: "Feb 20, 2026",
  location: "Open Stage",
  points: 320
}];
const FAKE_LEADERBOARD_INITIAL = [{
  rank: 1,
  name: "Arjun Sharma",
  points: 4520,
  avatar: "A"
}, {
  rank: 2,
  name: "Priya Patel",
  points: 3890,
  avatar: "P"
}, {
  rank: 3,
  name: "Rahul Kumar",
  points: 3450,
  avatar: "R"
}, {
  rank: 4,
  name: "Maya Singh",
  points: 3120,
  avatar: "M"
}, {
  rank: 5,
  name: "You",
  points: 2450,
  avatar: "Y",
  isUser: true
}];
const FAKE_PROJECTS = [{
  id: "1",
  name: "Alpha AI",
  icon: "🤖",
  status: "active",
  progress: 75
}, {
  id: "2",
  name: "Campus Connect",
  icon: "🎓",
  status: "active",
  progress: 40
}, {
  id: "3",
  name: "Event Tracker",
  icon: "📅",
  status: "paused",
  progress: 60
}];
const categoryIcons: Record<string, React.ReactNode> = {
  Tech: <Code className="h-3 w-3" />,
  Cultural: <Palette className="h-3 w-3" />,
  Management: <Briefcase className="h-3 w-3" />
};
const TRENDING_NEWS = {
  today: [{
    icon: <Zap className="h-4 w-4 text-primary" />,
    title: "Hackathon 2026 registrations now open!",
    time: "2 hours ago"
  }, {
    icon: <Trophy className="h-4 w-4 text-primary" />,
    title: "New leaderboard rewards announced",
    time: "4 hours ago"
  }, {
    icon: <Users className="h-4 w-4 text-primary" />,
    title: "Team formation deadline extended",
    time: "6 hours ago"
  }],
  week: [{
    icon: <Star className="h-4 w-4 text-primary" />,
    title: "Campus Fest week kicks off Monday",
    time: "2 days ago"
  }, {
    icon: <Target className="h-4 w-4 text-primary" />,
    title: "New achievement badges released",
    time: "3 days ago"
  }, {
    icon: <Calendar className="h-4 w-4 text-primary" />,
    title: "Spring events calendar published",
    time: "5 days ago"
  }],
  month: [{
    icon: <Award className="h-4 w-4 text-primary" />,
    title: "Annual awards ceremony date set",
    time: "2 weeks ago"
  }, {
    icon: <Code className="h-4 w-4 text-primary" />,
    title: "Tech club launches new program",
    time: "3 weeks ago"
  }, {
    icon: <Sparkles className="h-4 w-4 text-primary" />,
    title: "Alpha AI now available for all users",
    time: "4 weeks ago"
  }]
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
  return <motion.span className={cn(className, isAnimating && "text-emerald-400")} animate={isAnimating ? {
    scale: [1, 1.03, 1]
  } : {}} transition={{
    duration: 0.25
  }}>
      {prefix}{displayValue.toLocaleString()}
    </motion.span>;
}

// Loading skeleton for stats
function StatCardSkeleton() {
  return <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>;
}

// Loading skeleton for opportunities
function OpportunityCardSkeleton() {
  return <div className="bg-card border border-border rounded-xl p-5">
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
    </div>;
}
const Dashboard = () => {
  const navigate = useNavigate();
  const firstName = "Alex";
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsFilter, setNewsFilter] = useState<"today" | "week" | "month">("today");
  const [liveStats, setLiveStats] = useState({
    totalPoints: 2450,
    weeklyPoints: 198,
    eventsCount: 12,
    teamsCount: 3,
    rank: 5
  });
  const [leaderboard, setLeaderboard] = useState(FAKE_LEADERBOARD_INITIAL);
  const [recentChange, setRecentChange] = useState<{
    stat: string;
    amount: number;
  } | null>(null);

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
        setRecentChange({
          stat: "points",
          amount: increase
        });
      } else if (rand < 0.55) {
        setLiveStats(prev => ({
          ...prev,
          eventsCount: prev.eventsCount + 1
        }));
        setRecentChange({
          stat: "events",
          amount: 1
        });
      } else if (rand < 0.65) {
        setLiveStats(prev => ({
          ...prev,
          teamsCount: prev.teamsCount + 1
        }));
        setRecentChange({
          stat: "teams",
          amount: 1
        });
      } else if (rand < 0.75) {
        setLiveStats(prev => ({
          ...prev,
          rank: Math.max(1, prev.rank - 1)
        }));
        setRecentChange({
          stat: "rank",
          amount: -1
        });
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
  const stats = [{
    label: "Events",
    value: liveStats.eventsCount,
    icon: Calendar,
    change: "Joined",
    isChanging: recentChange?.stat === "events"
  }, {
    label: "Teams",
    value: liveStats.teamsCount,
    icon: Users,
    change: "Active",
    isChanging: recentChange?.stat === "teams"
  }, {
    label: "Rank",
    value: liveStats.rank,
    icon: TrendingUp,
    change: "Global",
    isRank: true,
    isChanging: recentChange?.stat === "rank"
  }];
  return <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        ease: "easeOut"
      }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight leading-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">
              Here's what's happening with your campus journey
            </p>
          </div>
          <Link to="/opportunities">
            <motion.div whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                Browse Opportunities
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Suggested Opportunities Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-lg tracking-tight">Suggested for You</h2>
                <p className="text-sm text-muted-foreground">Based on your interests</p>
              </div>
            </div>
            <Link to="/opportunities" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
                skipSnaps: true,
                containScroll: false,
                duration: 40,
              }}
              plugins={[
                Autoplay({
                  delay: 2000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                  playOnInit: true,
                }),
              ]}
              className="w-full cursor-grab active:cursor-grabbing select-none"
            >
            <CarouselContent className="-ml-4">
              {[...FAKE_OPPORTUNITIES, ...FAKE_OPPORTUNITIES].map((opp, index) => (
                <CarouselItem key={`${opp.id}-${index}`} className="pl-4 basis-[80%] sm:basis-[45%] lg:basis-[32%]">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.05 + (index % FAKE_OPPORTUNITIES.length) * 0.08,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.03,
                      transition: { 
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }
                    }}
                    className="group bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-5 cursor-pointer h-full select-none relative overflow-hidden"
                    onClick={() => navigate("/opportunities")}
                  >
                    {/* Animated border glow */}
                    <motion.div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                      initial={false}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), transparent 50%, hsl(var(--primary) / 0.1))",
                        boxShadow: "inset 0 0 0 1px hsl(var(--primary) / 0.3), 0 0 30px -5px hsl(var(--primary) / 0.25)"
                      }}
                    />
                    
                    {/* Inner glow effect */}
                    <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-sm pointer-events-none" />
                    
                    {/* Category Badge & Featured */}
                    <div className="relative flex items-center justify-between mb-4">
                      <motion.div 
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 border",
                          opp.category === "Tech" && "bg-blue-500/15 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/25 group-hover:border-blue-400/40 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-blue-500/30",
                          opp.category === "Cultural" && "bg-purple-500/15 text-purple-400 border-purple-500/20 group-hover:bg-purple-500/25 group-hover:border-purple-400/40 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-purple-500/30",
                          opp.category === "Management" && "bg-amber-500/15 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/25 group-hover:border-amber-400/40 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-amber-500/30",
                          opp.category === "Design" && "bg-pink-500/15 text-pink-400 border-pink-500/20 group-hover:bg-pink-500/25 group-hover:border-pink-400/40 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-pink-500/30",
                          opp.category === "Sports" && "bg-green-500/15 text-green-400 border-green-500/20 group-hover:bg-green-500/25 group-hover:border-green-400/40 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-green-500/30",
                          opp.category === "Research" && "bg-cyan-500/15 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-cyan-500/30"
                        )}
                      >
                        {categoryIcons[opp.category]}
                        {opp.category}
                      </motion.div>
                      {opp.is_featured && (
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          className="flex items-center gap-1 text-primary text-xs font-medium"
                        >
                          <Star className="h-3.5 w-3.5 fill-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]" />
                          Featured
                        </motion.div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="relative font-semibold text-foreground text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-400">
                      {opp.title}
                    </h3>

                    {/* Details */}
                    <div className="relative space-y-2.5 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs group-hover:text-muted-foreground/90 transition-colors duration-300">
                        <Clock className="h-3.5 w-3.5 group-hover:text-primary/70 transition-colors duration-300" />
                        <span>{opp.registration_deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs group-hover:text-muted-foreground/90 transition-colors duration-300">
                        <MapPin className="h-3.5 w-3.5 group-hover:text-primary/70 transition-colors duration-300" />
                        <span>{opp.location}</span>
                      </div>
                    </div>

                    {/* Points & CTA */}
                    <div className="relative flex items-center justify-between pt-3 border-t border-border/30 group-hover:border-primary/25 transition-all duration-400">
                      <div className="flex items-center gap-1.5">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.15, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                          }}
                        >
                          <Zap className="h-4 w-4 text-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.5)]" />
                        </motion.div>
                        <span className="font-bold text-foreground">{opp.points}</span>
                        <span className="text-muted-foreground text-xs">pts</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 px-3 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-400"
                      >
                        Join
                        <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:flex items-center justify-end gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0 h-9 w-9 bg-card/80 backdrop-blur border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300" />
              <CarouselNext className="static translate-y-0 h-9 w-9 bg-card/80 backdrop-blur border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300" />
            </div>
            </Carousel>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Featured Opportunities */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.25,
          duration: 0.5
        }} className="lg:col-span-2">
            {/* AI Chat Section Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground text-lg tracking-tight">Alpha AI</h2>
                  <p className="text-sm text-muted-foreground">by Camply</p>
                </div>
              </div>
              
              {/* Gen Z Mode & Settings */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">gen z mode</span>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* AI Chat Area */}
            <div className="bg-card border border-border rounded-xl h-[320px] flex flex-col">
              {/* Chat Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted/50 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm text-foreground">Hey! I'm Alpha AI, your campus assistant. Ask me anything about events, opportunities, or how to earn more points!</p>
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <input type="text" placeholder="Ask Alpha AI..." className="w-full bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none mb-3" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium border-border hover:bg-muted/50">
                      <Mic className="h-3.5 w-3.5" />
                      Talk to Alpha
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium border-border hover:bg-muted/50">
                      <Upload className="h-3.5 w-3.5" />
                      Upload Image
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-primary hover:opacity-90">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.35,
          duration: 0.5
        }} className="space-y-6">
            {/* Trending News */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">Trending News</span>
                </div>
              </div>
              
              {/* Time Filter Tabs */}
              <div className="flex border-b border-border">
                {(["today", "week", "month"] as const).map(filter => <button key={filter} onClick={() => setNewsFilter(filter)} className={cn("flex-1 py-2.5 text-xs font-medium transition-all", newsFilter === filter ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                    {filter === "today" ? "Today" : filter === "week" ? "This Week" : "This Month"}
                  </button>)}
              </div>
              
              {/* News Items */}
              <div className="divide-y divide-border/60">
                <AnimatePresence mode="wait">
                  {TRENDING_NEWS[newsFilter].map((news, index) => <motion.div key={`${newsFilter}-${index}`} initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} transition={{
                  delay: index * 0.05
                }} className="px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {news.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{news.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{news.time}</p>
                        </div>
                      </div>
                    </motion.div>)}
                </AnimatePresence>
              </div>
            </div>

            {/* My Projects */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">My Projects</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                  {FAKE_PROJECTS.filter(p => p.status === "active").length} active
                </span>
              </div>
              <div className="space-y-2.5">
                {FAKE_PROJECTS.map((project, index) => <motion.div 
                  key={project.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 2 }}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200",
                    project.status === "active" 
                      ? "bg-muted/50 hover:bg-muted" 
                      : "bg-muted/30 opacity-60"
                  )}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                    {project.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>)}
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
                  <motion.div whileHover={{
                  scale: 1.01
                }} whileTap={{
                  scale: 0.99
                }}>
                    <Button variant="outline" size="sm" className="w-full justify-start h-10 text-sm border-border hover:bg-muted hover:border-border/60 text-foreground transition-all duration-200">
                      <Users className="h-4 w-4 mr-2.5 text-muted-foreground" />
                      Find Teammates
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/profile" className="block">
                  <motion.div whileHover={{
                  scale: 1.01
                }} whileTap={{
                  scale: 0.99
                }}>
                    <Button variant="outline" size="sm" className="w-full justify-start h-10 text-sm border-border hover:bg-muted hover:border-border/60 text-foreground transition-all duration-200">
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
    </DashboardLayout>;
};
export default Dashboard;