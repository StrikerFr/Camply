import { Trophy, Medal, Award, TrendingUp, ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const initialLeaderboardData = [
  { id: 1, name: "Priya Sharma", college: "IIT Delhi", points: 2840 },
  { id: 2, name: "Arjun Patel", college: "BITS Pilani", points: 2720 },
  { id: 3, name: "Sneha Reddy", college: "NIT Trichy", points: 2650 },
  { id: 4, name: "Rahul Kumar", college: "IIT Bombay", points: 2580 },
  { id: 5, name: "Ananya Singh", college: "VIT Vellore", points: 2510 },
  { id: 6, name: "Vikram Mehta", college: "IIIT Hyderabad", points: 2450 },
  { id: 7, name: "Kavya Nair", college: "NIT Surathkal", points: 2380 },
  { id: 8, name: "Aditya Verma", college: "IIT Kanpur", points: 2320 },
  { id: 9, name: "Meera Joshi", college: "BITS Goa", points: 2260 },
  { id: 10, name: "Rohan Gupta", college: "IIT Madras", points: 2200 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-semibold">{rank}</span>;
  }
};

export const LeaderboardPreview = () => {
  const [leaderboard, setLeaderboard] = useState(initialLeaderboardData);
  const [changedId, setChangedId] = useState<number | null>(null);
  const [pointChange, setPointChange] = useState<{ id: number; change: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard((prev) => {
        const newData = [...prev];
        // Pick a random user (not first place) to gain points
        const randomIndex = Math.floor(Math.random() * (newData.length - 1)) + 1;
        const pointGain = Math.floor(Math.random() * 50) + 20;
        
        newData[randomIndex] = {
          ...newData[randomIndex],
          points: newData[randomIndex].points + pointGain,
        };
        
        setChangedId(newData[randomIndex].id);
        setPointChange({ id: newData[randomIndex].id, change: pointGain });
        
        // Sort by points
        newData.sort((a, b) => b.points - a.points);
        
        return newData;
      });

      // Clear the highlight after animation
      setTimeout(() => {
        setChangedId(null);
        setPointChange(null);
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const displayedLeaderboard = isExpanded ? leaderboard : leaderboard.slice(0, 5);

  return (
    <section id="leaderboards" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Compete & <span className="text-gradient">Rise</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Climb the leaderboards, earn recognition, and showcase your campus achievements
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="scale">
          <div className="max-w-3xl mx-auto" style={{ perspective: "1000px" }}>
            <motion.div
              className="glass rounded-2xl overflow-hidden cursor-pointer"
              initial={{ rotateX: 15, rotateY: -5 }}
              whileInView={{ rotateX: 0, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onHoverStart={() => setIsExpanded(true)}
              onHoverEnd={() => setIsExpanded(false)}
              onClick={() => setIsExpanded((prev) => !prev)}
              whileHover={{ 
                rotateX: 5, 
                rotateY: 5, 
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Header */}
              <div className="bg-primary/10 px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-semibold text-foreground">
                    Top Performers This Week
                  </h3>
                  <div className="flex items-center gap-2 text-primary">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <TrendingUp className="h-4 w-4" />
                    </motion.div>
                    <span className="text-sm font-medium">Live Rankings</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard Rows */}
              <motion.div 
                className="divide-y divide-border"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {displayedLeaderboard.map((user, index) => {
                    const rank = leaderboard.findIndex(u => u.id === user.id) + 1;
                    const isChanged = changedId === user.id;
                    const change = pointChange?.id === user.id ? pointChange.change : null;
                    
                    return (
                      <motion.div
                        key={user.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: 1, 
                          height: "auto",
                          backgroundColor: isChanged ? "rgba(34, 197, 94, 0.1)" : "transparent"
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          layout: { type: "spring", stiffness: 300, damping: 30 },
                          duration: 0.3,
                          delay: index > 4 ? (index - 4) * 0.05 : 0
                        }}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors relative overflow-hidden"
                      >
                        {/* Rank */}
                        <motion.div 
                          className="w-10 flex justify-center"
                          layout
                        >
                          {getRankIcon(rank)}
                        </motion.div>

                        {/* Avatar */}
                        <motion.div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            isChanged ? "bg-green-500/30 text-green-400" : "bg-primary/20 text-primary"
                          }`}
                          animate={isChanged ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.college}</p>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <motion.p 
                            className="font-display font-bold text-foreground"
                            animate={isChanged ? { scale: [1, 1.1, 1] } : {}}
                          >
                            {user.points.toLocaleString()}
                          </motion.p>
                          <AnimatePresence>
                            {change && (
                              <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-green-500 font-medium"
                              >
                                +{change} pts
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Glow effect on change */}
                        {isChanged && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5 }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Expand hint */}
              <AnimatePresence>
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-2 bg-gradient-to-t from-secondary/80 to-transparent flex items-center justify-center gap-2 text-muted-foreground"
                  >
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                    <span className="text-xs md:hidden">Tap to see more</span>
                    <span className="text-xs hidden md:inline">Hover to see more</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="px-6 py-4 bg-secondary/30 text-center">
                <p className="text-sm text-muted-foreground">
                  Join now to see where you rank among 10,000+ students
                </p>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
