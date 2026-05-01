import { useState, useEffect } from "react";
import { 
  Brain, 
  Calendar, 
  Shield, 
  Trophy, 
  Users, 
  Star,
  Zap,
  Building2,
  X,
  Sparkles
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { Tilt } from "@/components/ui/tilt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Discovery",
    description: "Gemini-powered recommendations that learn your preferences and surface relevant opportunities automatically.",
    gradient: "from-rose-500/20 to-primary/20",
    details: {
      benefits: [
        "Personalized opportunity matching based on your interests",
        "Smart filters that learn from your interactions",
        "Real-time updates as new opportunities arise",
      ],
      stats: "95% match accuracy",
    },
  },
  {
    icon: Calendar,
    title: "Unified Event Hub",
    description: "All campus events, hackathons, workshops, and competitions in one searchable, filterable platform.",
    gradient: "from-primary/20 to-rose-500/20",
    details: {
      benefits: [
        "Centralized calendar for all campus activities",
        "Advanced search with category filters",
        "Integration with your personal calendar",
      ],
      stats: "500+ events tracked",
    },
  },
  {
    icon: Users,
    title: "Smart Team Formation",
    description: "Find teammates with complementary skills. AI suggests balanced teams for optimal collaboration.",
    gradient: "from-rose-500/20 to-primary/20",
    details: {
      benefits: [
        "Skill-based teammate recommendations",
        "Team compatibility scoring",
        "Built-in communication tools",
      ],
      stats: "1000+ teams formed",
    },
  },
  {
    icon: Shield,
    title: "Verified Participation",
    description: "QR check-ins and organizer verification ensure only genuine participation counts toward your profile.",
    gradient: "from-primary/20 to-rose-500/20",
    details: {
      benefits: [
        "Instant QR code check-in system",
        "Organizer verification dashboard",
        "Tamper-proof participation records",
      ],
      stats: "100% verified records",
    },
  },
  {
    icon: Trophy,
    title: "Points & Leaderboards",
    description: "Earn points for participation and performance. Compete on college-wide and domain-specific leaderboards.",
    gradient: "from-rose-500/20 to-primary/20",
    details: {
      benefits: [
        "Dynamic point system based on difficulty",
        "Weekly, monthly, and all-time rankings",
        "Special badges for achievements",
      ],
      stats: "50K+ points awarded",
    },
  },
  {
    icon: Star,
    title: "Anonymous Reviews",
    description: "Share honest feedback on events anonymously. Help others make informed decisions.",
    gradient: "from-primary/20 to-rose-500/20",
    details: {
      benefits: [
        "Completely anonymous review system",
        "Detailed rating categories",
        "Helpful vote system for best reviews",
      ],
      stats: "2000+ reviews",
    },
  },
  {
    icon: Zap,
    title: "Real-time Notifications",
    description: "Never miss deadlines or team invites. Get instant alerts for opportunities that match your interests.",
    gradient: "from-rose-500/20 to-primary/20",
    details: {
      benefits: [
        "Push notifications for deadlines",
        "Team invite alerts",
        "Customizable notification preferences",
      ],
      stats: "Instant delivery",
    },
  },
  {
    icon: Building2,
    title: "Organizer Dashboard",
    description: "Clubs and organizers can create events, track attendance, and view participation analytics.",
    gradient: "from-primary/20 to-rose-500/20",
    details: {
      benefits: [
        "Easy event creation wizard",
        "Real-time attendance tracking",
        "Comprehensive analytics dashboard",
      ],
      stats: "100+ organizers",
    },
  },
];

// Split features into two rows
const row1Features = features.slice(0, 4);
const row2Features = features.slice(4, 8);

const FeatureCard = ({ 
  feature, 
  onClick 
}: { 
  feature: typeof features[0];
  onClick: () => void;
}) => (
  <Tilt
    rotationFactor={12}
    springOptions={{ stiffness: 300, damping: 20 }}
    className="h-full min-w-[280px] md:min-w-[320px]"
  >
    <motion.div 
      className="group relative h-full cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.02, z: 50 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* 3D lighting effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
          transform: "translateZ(20px)",
        }}
      />
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
      
      {/* Card content */}
      <div 
        className="relative glass rounded-2xl p-6 h-full glass-hover border border-white/5 group-hover:border-primary/20 transition-all duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Floating icon */}
        <motion.div 
          className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          style={{ transform: "translateZ(30px)" }}
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
        >
          <feature.icon className="h-6 w-6" />
        </motion.div>
        
        {/* Title with depth */}
        <h3 
          className="text-lg font-display font-semibold text-foreground mb-2"
          style={{ transform: "translateZ(20px)" }}
        >
          {feature.title}
        </h3>
        
        {/* Description */}
        <p 
          className="text-sm text-muted-foreground leading-relaxed"
          style={{ transform: "translateZ(10px)" }}
        >
          {feature.description}
        </p>

        {/* Click indicator */}
        <motion.div 
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: "translateZ(40px)" }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </motion.div>
      </div>
    </motion.div>
  </Tilt>
);

const FeatureModal = ({ 
  feature, 
  isOpen, 
  onClose 
}: { 
  feature: typeof features[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!feature) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass border-white/10 overflow-hidden">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-30`} />
        
        <DialogHeader className="relative">
          <motion.div 
            className="p-4 rounded-2xl bg-primary/20 text-primary w-fit mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <feature.icon className="h-8 w-8" />
          </motion.div>
          
          <DialogTitle className="text-2xl font-display font-bold text-foreground">
            {feature.title}
          </DialogTitle>
          
          <DialogDescription className="text-muted-foreground">
            {feature.description}
          </DialogDescription>
        </DialogHeader>

        <div className="relative space-y-6 pt-4">
          {/* Stats badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4" />
            {feature.details.stats}
          </motion.div>

          {/* Benefits list */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Key Benefits
            </h4>
            <ul className="space-y-2">
              {feature.details.benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FeaturesSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const row1Controls = useAnimationControls();
  const row2Controls = useAnimationControls();

  // Auto-start animations on mount (fixes mobile)
  useEffect(() => {
    row1Controls.start({
      x: [0, -1400],
      transition: {
        x: {
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        },
      },
    });
    row2Controls.start({
      x: [-1400, 0],
      transition: {
        x: {
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        },
      },
    });
  }, [row1Controls, row2Controls]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    row1Controls.stop();
    row2Controls.stop();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    row1Controls.start({
      x: [null, -1400],
      transition: {
        x: {
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        },
      },
    });
    row2Controls.start({
      x: [null, 0],
      transition: {
        x: {
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        },
      },
    });
  };

  const handleCardClick = (feature: typeof features[0]) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFeature(null);
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Full-width container for edge-to-edge marquee */}
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="text-gradient">Excel</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete ecosystem for discovering opportunities, building teams, 
              and earning recognition
            </p>
          </div>
        </ScrollReveal>

      </div>

      {/* Row 1 - Right to Left - Full width outside container */}
      <div 
        className="relative mb-6 -mx-6 md:-mx-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient fade edges - wider for better blending */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
          
        <motion.div
          className="flex gap-6 px-6"
            animate={row1Controls}
            initial={{ x: 0 }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            onAnimationComplete={() => {
              if (!isPaused) {
                row1Controls.start({
                  x: [0, -1400],
                  transition: {
                    x: {
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  },
                });
              }
            }}
            style={{ x: 0 }}
          >
            {/* Duplicate cards for seamless loop */}
            {[...row1Features, ...row1Features, ...row1Features].map((feature, index) => (
              <FeatureCard 
                key={`row1-${index}`} 
                feature={feature} 
                onClick={() => handleCardClick(feature)}
              />
            ))}
        </motion.div>
      </div>

      {/* Row 2 - Left to Right - Full width */}
      <div 
        className="relative -mx-6 md:-mx-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient fade edges - wider for better blending */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        <motion.div
          className="flex gap-6 px-6"
          animate={row2Controls}
          initial={{ x: -1400 }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          onAnimationComplete={() => {
            if (!isPaused) {
              row2Controls.start({
                x: [-1400, 0],
                transition: {
                  x: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  },
                },
              });
            }
          }}
          style={{ x: -1400 }}
        >
          {/* Duplicate cards for seamless loop */}
          {[...row2Features, ...row2Features, ...row2Features].map((feature, index) => (
            <FeatureCard 
              key={`row2-${index}`} 
              feature={feature} 
              onClick={() => handleCardClick(feature)}
            />
          ))}
        </motion.div>
      </div>

      {/* Feature Details Modal */}
      <FeatureModal 
        feature={selectedFeature} 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
      />
    </section>
  );
};
