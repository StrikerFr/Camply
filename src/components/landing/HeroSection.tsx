import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Starfield } from "@/components/ui/starfield";
import { ShootingStars } from "@/components/ui/shooting-stars";

export const HeroSection = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Opportunities", "Networking", "Progress", "Hackathons", "Events", "Competitions"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 px-4 sm:px-6">
      {/* Shader Animation Background */}
      <div className="absolute inset-0 z-0">
        <ShaderAnimation />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/60 z-[1]" />

      {/* Starfield visible in hero */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <Starfield starCount={80} />
      </div>

      {/* Shooting Stars in hero */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <ShootingStars
          starColor="#ffffff"
          trailColor="#f97316"
          starWidth={20}
          starHeight={3}
          minSpeed={8}
          maxSpeed={18}
          minDelay={1200}
          maxDelay={3000}
        />
        <ShootingStars
          starColor="#fbbf24"
          trailColor="#ef4444"
          starWidth={15}
          starHeight={2}
          minSpeed={6}
          maxSpeed={14}
          minDelay={1800}
          maxDelay={3500}
        />
      </div>

      <div className="container mx-auto relative z-10 pointer-events-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              The future of campus opportunities
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 sm:mb-6"
          >
            <span className="text-foreground block mb-2 sm:mb-4">Camply Means</span>
            <span className="relative flex w-full justify-center text-center min-h-[1.85em] py-[0.2em] overflow-visible">
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute inset-x-0 top-0 text-gradient leading-[1.12] transform-gpu text-3xl sm:text-5xl md:text-7xl lg:text-8xl"
                  initial={{ opacity: 0, y: "-1.0em" }}
                  transition={{
                    y: { type: "spring", stiffness: 90, damping: 18 },
                    opacity: { duration: 0.18, ease: "easeOut" },
                  }}
                  animate={
                    titleNumber === index
                      ? {
                          y: 0,
                          opacity: 1,
                        }
                      : {
                          y: titleNumber > index ? "-1.4em" : "1.4em",
                          opacity: 0,
                        }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
            
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-2"
          >
            Camply is the first college-focused platform that centralizes all campus opportunities — 
            events, hackathons, competitions — with AI-powered discovery and verified reputation building.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="hero" size="lg" className="group [&_svg]:size-4 sm:[&_svg]:size-5 w-full sm:w-auto">
                Get Started Free
                <span className="arrow-premium">
                  <ArrowRight className="arrow-icon" />
                  <span className="arrow-glow" />
                </span>
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">
                Login to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <AnimatedCounter 
                  target={50} 
                  suffix="+" 
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground transition-colors duration-300 group-hover:text-primary"
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">Events Monthly</p>
            </div>
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <AnimatedCounter 
                  target={10000} 
                  suffix="+" 
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground transition-colors duration-300 group-hover:text-primary"
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">Active Students</p>
            </div>
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <AnimatedCounter 
                  target={100} 
                  suffix="+" 
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground transition-colors duration-300 group-hover:text-primary"
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">Colleges</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-[2]" />
    </section>
  );
};
