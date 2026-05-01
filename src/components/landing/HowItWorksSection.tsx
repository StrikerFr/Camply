import { UserPlus, Sparkles, Search, Users, CheckCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { DrawerStack3D } from "./DrawerStack3D";
import { Starfield } from "@/components/ui/starfield";
import { ShootingStars } from "@/components/ui/shooting-stars";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your profile with your college, interests, and skills.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "Get personalized opportunity recommendations based on your profile.",
  },
  {
    icon: Search,
    title: "Discover",
    description: "Browse all campus events, hackathons, competitions, and workshops.",
  },
  {
    icon: Users,
    title: "Build Team",
    description: "Find teammates with complementary skills for team events.",
  },
  {
    icon: CheckCircle,
    title: "Participate",
    description: "Attend events and get your participation verified.",
  },
  {
    icon: Trophy,
    title: "Build Reputation",
    description: "Earn points, climb leaderboards, and showcase your achievements.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-background overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 pointer-events-none">
        <Starfield starCount={100} />
      </div>
      
      {/* Shooting stars / meteors */}
      <ShootingStars 
        starColor="hsl(var(--primary))" 
        trailColor="hsl(var(--primary) / 0.3)"
        minDelay={2000}
        maxDelay={5000}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      {/* Perspective container background effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, hsl(var(--primary) / 0.03), transparent)',
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          {/* Animated heading */}
          <motion.h2 
            className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 relative inline-block cursor-default"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block mr-1.5 md:mr-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              How
            </motion.span>
            <motion.span 
              className="text-primary relative inline-block group cursor-pointer mx-0.5 md:mx-1"
              whileHover={{ 
                scale: 1.08,
                textShadow: "0 0 30px hsl(var(--primary) / 0.6)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Glow effect behind text */}
              <motion.span 
                className="absolute inset-0 blur-2xl bg-primary/30 rounded-full -z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.3 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              />
              Camply
              {/* Animated underline */}
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              />
              {/* Shimmer effect on hover */}
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
              </motion.span>
            </motion.span>
            <motion.span
              className="inline-block ml-1.5 md:ml-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Works
            </motion.span>
          </motion.h2>
          
          {/* Subheading with stagger animation */}
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block hover:text-foreground transition-colors duration-300 cursor-default"
              whileHover={{ scale: 1.02 }}
            >
              From discovery to recognition in six simple steps
            </motion.span>
          </motion.p>
        </div>

        {/* 3D Drawer Stack */}
        <DrawerStack3D steps={steps} />
      </div>
    </section>
  );
};
