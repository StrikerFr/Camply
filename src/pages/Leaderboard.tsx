import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Crown, Medal, Sparkles, Trophy, TrendingUp, TrendingDown, Zap, Flame, Star, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimeFilter = "This Week" | "This Month" | "All Time";
type CategoryFilter = "Overall" | "Hackathons" | "Competitions" | "Workshops";

const timeFilters: TimeFilter[] = ["This Week", "This Month", "All Time"];
const categoryFilters: CategoryFilter[] = ["Overall", "Hackathons", "Competitions", "Workshops"];

type MockEntry = {
  id: string;
  full_name: string;
  avatar_initial: string;
  primary_category: Exclude<CategoryFilter, "Overall">;
  points: { week: number; month: number; all: number };
  streak?: number;
};

type RankedEntry = MockEntry & { 
  display_points: number; 
  rank: number;
  prevRank?: number;
  pointsChange?: number;
};

const ME_ID = "me";

const INITIAL_ENTRIES: MockEntry[] = [
  { id: "u1", full_name: "Arjun Sharma", avatar_initial: "A", primary_category: "Hackathons", points: { week: 540, month: 1240, all: 4520 }, streak: 12 },
  { id: "u2", full_name: "Priya Patel", avatar_initial: "P", primary_category: "Competitions", points: { week: 420, month: 980, all: 3890 }, streak: 8 },
  { id: "u3", full_name: "Rahul Kumar", avatar_initial: "R", primary_category: "Workshops", points: { week: 380, month: 860, all: 3450 }, streak: 5 },
  { id: "u4", full_name: "Sneha Iyer", avatar_initial: "S", primary_category: "Hackathons", points: { week: 310, month: 740, all: 3120 }, streak: 7 },
  { id: ME_ID, full_name: "Alex", avatar_initial: "A", primary_category: "Competitions", points: { week: 180, month: 620, all: 2450 }, streak: 3 },
  { id: "u6", full_name: "Karan Singh", avatar_initial: "K", primary_category: "Workshops", points: { week: 160, month: 520, all: 2210 } },
  { id: "u7", full_name: "Meera Nair", avatar_initial: "M", primary_category: "Competitions", points: { week: 140, month: 480, all: 1980 } },
  { id: "u8", full_name: "Aditya Verma", avatar_initial: "A", primary_category: "Hackathons", points: { week: 120, month: 420, all: 1760 } },
  { id: "u9", full_name: "Neha Gupta", avatar_initial: "N", primary_category: "Workshops", points: { week: 110, month: 390, all: 1620 } },
  { id: "u10", full_name: "Vikram Das", avatar_initial: "V", primary_category: "Hackathons", points: { week: 90, month: 360, all: 1490 } },
  { id: "u11", full_name: "Ishita Roy", avatar_initial: "I", primary_category: "Competitions", points: { week: 80, month: 310, all: 1320 } },
  { id: "u12", full_name: "Sahil Khan", avatar_initial: "S", primary_category: "Workshops", points: { week: 70, month: 280, all: 1210 } },
];

function getPoints(entry: MockEntry, activeTime: TimeFilter) {
  switch (activeTime) {
    case "This Week": return entry.points.week;
    case "This Month": return entry.points.month;
    default: return entry.points.all;
  }
}

// Floating sparkle component
function FloatingSparkle({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute text-primary/60"
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        y: [-10, -30, -50],
        x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
      }}
    >
      <Star className="h-3 w-3 fill-current" />
    </motion.div>
  );
}

// Podium card for top 3
function PodiumCard({
  entry,
  position,
  isVisible,
}: {
  entry: RankedEntry;
  position: 1 | 2 | 3;
  isVisible: boolean;
}) {
  const isFirst = position === 1;
  const isSecond = position === 2;
  const isThird = position === 3;

  const podiumHeight = isFirst ? "h-44" : isSecond ? "h-36" : "h-32";
  const avatarSize = isFirst ? "w-20 h-20" : "w-16 h-16";
  const delay = isFirst ? 0.2 : isSecond ? 0.1 : 0.3;

  const badgeColors = {
    1: "from-yellow-400 via-yellow-500 to-amber-600",
    2: "from-slate-300 via-slate-400 to-slate-500",
    3: "from-orange-400 via-orange-500 to-amber-700",
  };

  const glowColors = {
    1: "shadow-yellow-500/30",
    2: "shadow-slate-400/20",
    3: "shadow-orange-500/20",
  };

  const rankLabels = { 1: "1st", 2: "2nd", 3: "3rd" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={cn(
        "relative flex flex-col items-center",
        isFirst && "order-2",
        isSecond && "order-1",
        isThird && "order-3"
      )}
    >
      {/* Floating sparkles for 1st place */}
      {isFirst && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <FloatingSparkle delay={0} />
          <FloatingSparkle delay={0.5} />
          <FloatingSparkle delay={1} />
        </div>
      )}

      {/* Crown for 1st place */}
      {isFirst && (
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute -top-8 z-10"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Crown className="h-8 w-8 text-yellow-500 drop-shadow-lg" fill="currentColor" />
          </motion.div>
        </motion.div>
      )}

      {/* Card */}
      <motion.div
        className={cn(
          "relative rounded-2xl bg-card border-2 p-5 w-full",
          isFirst ? "border-primary/40 shadow-xl" : "border-border shadow-md",
          isFirst && glowColors[1]
        )}
        whileHover={{ boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)" }}
      >
        {/* Rank badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
          className={cn(
            "absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg bg-gradient-to-br",
            badgeColors[position]
          )}
        >
          {rankLabels[position]}
        </motion.div>

        {/* Streak badge */}
        {entry.streak && entry.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: delay + 0.4 }}
            className="absolute -top-2 -left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-medium shadow-md"
          >
            <Flame className="h-3 w-3" />
            {entry.streak}
          </motion.div>
        )}

        <div className="flex flex-col items-center text-center pt-3">
          {/* Avatar with glow */}
          <motion.div
            className={cn(
              "relative rounded-2xl flex items-center justify-center font-bold text-white shadow-lg",
              avatarSize,
              isFirst
                ? "bg-gradient-to-br from-primary via-primary to-accent text-2xl"
                : "bg-gradient-to-br from-secondary to-muted text-secondary-foreground text-xl"
            )}
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          >
            {isFirst && (
              <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse" />
            )}
            <span className="relative z-10">{entry.avatar_initial}</span>
          </motion.div>

          {/* Medal icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + 0.35, type: "spring" }}
            className="mt-3"
          >
            {isFirst ? (
              <Trophy className="h-5 w-5 text-primary" />
            ) : (
              <Medal className="h-5 w-5 text-muted-foreground" />
            )}
          </motion.div>

          {/* Name */}
          <p className="mt-2 font-semibold text-foreground truncate w-full">{entry.full_name}</p>
          <p className="text-xs text-muted-foreground">{entry.primary_category}</p>

          {/* Points with animation */}
          <motion.div
            className="mt-3 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.5 }}
          >
            <Zap className={cn("h-4 w-4", isFirst ? "text-primary" : "text-muted-foreground")} />
            <motion.span
              className={cn("font-display font-bold", isFirst ? "text-lg text-foreground" : "text-foreground")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={entry.display_points}
            >
              {entry.display_points.toLocaleString()}
            </motion.span>
            <span className="text-sm text-muted-foreground">pts</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Podium base */}
      <motion.div
        initial={{ height: 0 }}
        animate={isVisible ? { height: "auto" } : {}}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        className={cn(
          "w-full rounded-b-xl bg-gradient-to-t mt-0",
          podiumHeight,
          isFirst
            ? "from-primary/20 to-primary/5"
            : isSecond
            ? "from-muted/60 to-muted/20"
            : "from-orange-500/10 to-orange-500/5"
        )}
      />
    </motion.div>
  );
}

const Leaderboard = () => {
  const [activeTime, setActiveTime] = useState<TimeFilter>("All Time");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Overall");
  const [entries, setEntries] = useState<MockEntry[]>(INITIAL_ENTRIES);
  const [prevRanks, setPrevRanks] = useState<Record<string, number>>({});

  // Live score updates - randomly adjust points every 3-5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEntries(prev => {
        const newEntries = prev.map(entry => {
          // Random chance to update this entry (30% chance)
          if (Math.random() > 0.3) return entry;
          
          // Random point change between -50 and +150
          const change = Math.floor(Math.random() * 200) - 50;
          const timeKey = activeTime === "This Week" ? "week" : activeTime === "This Month" ? "month" : "all";
          
          return {
            ...entry,
            points: {
              ...entry.points,
              [timeKey]: Math.max(0, entry.points[timeKey] + change)
            }
          };
        });
        return newEntries;
      });
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [activeTime]);

  const ranked = useMemo<RankedEntry[]>(() => {
    const filtered =
      activeCategory === "Overall"
        ? entries
        : entries.filter((e) => e.primary_category === activeCategory);

    const sorted = filtered
      .map((e) => ({ ...e, display_points: getPoints(e, activeTime) }))
      .sort((a, b) => b.display_points - a.display_points)
      .map((e, idx) => ({ 
        ...e, 
        rank: idx + 1,
        prevRank: prevRanks[e.id],
        pointsChange: prevRanks[e.id] !== undefined ? (prevRanks[e.id] - (idx + 1)) : 0
      }));

    return sorted;
  }, [activeCategory, activeTime, entries, prevRanks]);

  // Track previous ranks for animations
  useEffect(() => {
    const newPrevRanks: Record<string, number> = {};
    ranked.forEach(entry => {
      newPrevRanks[entry.id] = entry.rank;
    });
    setPrevRanks(newPrevRanks);
  }, [ranked]);

  const me = ranked.find((e) => e.id === ME_ID);
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm font-medium">Live Rankings</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-1.5 sm:mb-2">Campus Leaderboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">See how you stack up against other students</p>
        </motion.div>

        {/* Your Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-[40px]" />

          <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg sm:text-2xl font-bold text-primary-foreground shadow-lg"
                whileHover={{ rotate: [0, -5, 5, 0] }}
              >
                {me?.avatar_initial ?? "Y"}
              </motion.div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Your Rank</p>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <motion.span
                    className="text-2xl sm:text-4xl font-display font-bold text-foreground"
                    key={me?.rank}
                    initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                    animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                    transition={{ duration: 0.3 }}
                  >
                    {me ? `#${me.rank}` : "—"}
                  </motion.span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">Active</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
                  {me?.full_name ?? "You"} • {activeCategory} • {activeTime}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs sm:text-sm text-muted-foreground">Points</p>
              <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <motion.span
                  className="text-xl sm:text-3xl font-display font-bold text-foreground"
                  key={me?.display_points}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {me?.display_points?.toLocaleString() ?? "0"}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {timeFilters.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveTime(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all",
                  activeTime === filter
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                )}
              >
                {filter}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:ml-auto scrollbar-none -mx-1 px-1">
            {categoryFilters.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveCategory(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all",
                  activeCategory === filter
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Podium - Hide on small mobile, show simplified on md+ */}
        <AnimatePresence mode="wait">
          {top3.length >= 3 && (
            <motion.div
              key={`${activeTime}-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden sm:grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 sm:pt-8 pb-2 sm:pb-4"
            >
              <PodiumCard entry={top3[1]} position={2} isVisible={true} />
              <PodiumCard entry={top3[0]} position={1} isVisible={true} />
              <PodiumCard entry={top3[2]} position={3} isVisible={true} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard List - Show top3 in list on mobile */}
        {(rest.length > 0 || (top3.length > 0 && typeof window !== 'undefined')) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm"
          >
            <LayoutGroup>
              <div className="divide-y divide-border">
                {/* Mobile-only: Show top 3 in list format */}
                <AnimatePresence mode="popLayout">
                  {/* Show all entries on mobile (including top 3), only rest on desktop */}
                  {(typeof window !== 'undefined' && window.innerWidth < 640 ? ranked : rest).map((user) => {
                    const rankChange = user.pointsChange || 0;
                    const isMovingUp = rankChange > 0;
                    const isMovingDown = rankChange < 0;
                    const isTop3 = user.rank <= 3;
                    
                    return (
                      <motion.div
                        key={user.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          backgroundColor: isMovingUp 
                            ? "hsl(142.1 76.2% 36.3% / 0.1)" 
                            : isMovingDown 
                            ? "hsl(0 84.2% 60.2% / 0.1)"
                            : "transparent"
                        }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ 
                          layout: { type: "spring", stiffness: 300, damping: 30 },
                          backgroundColor: { duration: 0.5 }
                        }}
                        whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                        className={cn(
                          "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 transition-colors cursor-pointer relative",
                          isTop3 && "sm:hidden"
                        )}
                      >
                        {/* Rank with change indicator */}
                        <div className="w-8 sm:w-10 flex items-center justify-center gap-0.5 sm:gap-1">
                          <motion.span 
                            className={cn(
                              "font-semibold text-sm sm:text-base",
                              isTop3 ? "text-primary" : "text-muted-foreground"
                            )}
                            key={user.rank}
                            initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
                            animate={{ scale: 1, color: isTop3 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                            transition={{ duration: 0.3 }}
                          >
                            {user.rank}
                          </motion.span>
                          <AnimatePresence mode="wait">
                            {rankChange !== 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className={cn(
                                  "flex items-center text-xs font-medium",
                                  isMovingUp ? "text-green-500" : "text-primary"
                                )}
                              >
                                {isMovingUp ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : (
                                  <ArrowDown className="h-3 w-3" />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.div
                          layout
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-secondary flex items-center justify-center text-xs sm:text-sm font-bold text-secondary-foreground"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {user.avatar_initial}
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <p className="font-medium text-sm sm:text-base text-foreground truncate">{user.full_name}</p>
                            {user.id === ME_ID && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-primary/10 text-primary"
                              >
                                You
                              </motion.span>
                            )}
                            {user.streak && user.streak > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-orange-500 text-xs">
                                <Flame className="h-3 w-3" />
                                {user.streak}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{user.primary_category}</p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <AnimatePresence mode="wait">
                            {isMovingUp ? (
                              <motion.div
                                key="up"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20"
                              >
                                <TrendingUp className="h-5 w-5 text-green-400" />
                              </motion.div>
                            ) : isMovingDown ? (
                              <motion.div
                                key="down"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-primary/20"
                              >
                                <TrendingDown className="h-5 w-5 text-primary" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="neutral"
                                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-primary/10"
                              >
                                <Zap className="h-4 w-4 text-primary" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <motion.div
                            key={user.display_points}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                          >
                            {/* Glowing background pulse */}
                            <motion.div
                              initial={{ 
                                opacity: 1,
                                scale: 1
                              }}
                              animate={{ 
                                opacity: 0,
                                scale: 1.5
                              }}
                              transition={{ duration: 0.8 }}
                              className={cn(
                                "absolute inset-0 rounded-lg blur-md",
                                isMovingUp ? "bg-green-500" : isMovingDown ? "bg-red-500" : "bg-primary"
                              )}
                            />
                            
                            {/* Points badge */}
                            <motion.div
                              initial={{ 
                                backgroundColor: isMovingUp ? "rgb(34, 197, 94)" : isMovingDown ? "rgb(239, 68, 68)" : "hsl(var(--primary))"
                              }}
                              animate={{ 
                                backgroundColor: "hsl(var(--secondary))"
                              }}
                              transition={{ duration: 1.2 }}
                              className="relative px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg"
                            >
                              <motion.span
                                initial={{ 
                                  color: "#ffffff",
                                  textShadow: "0 0 30px currentColor"
                                }}
                                animate={{ 
                                  color: "hsl(var(--foreground))",
                                  textShadow: "none"
                                }}
                                transition={{ duration: 1 }}
                                className="font-bold text-sm sm:text-lg"
                              >
                                {user.display_points.toLocaleString()}
                              </motion.span>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </motion.div>
        )}

        {/* Fallback empty */}
        {ranked.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-center py-8 sm:py-12 bg-card border border-border rounded-xl sm:rounded-2xl"
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🏆</div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">No rankings yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">Be the first to earn points and climb the leaderboard!</p>
            <Button size="sm" asChild>
              <Link to="/opportunities">Browse Opportunities</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
