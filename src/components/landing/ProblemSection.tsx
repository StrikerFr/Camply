import { AlertCircle, Calendar, Search, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "@/components/ui/spotlight";

const problems = [
  {
    icon: Search,
    title: "Scattered Information",
    description: "Campus opportunities are spread across WhatsApp groups, notice boards, and random emails. You miss out on what matters.",
  },
  {
    icon: Calendar,
    title: "Missed Deadlines",
    description: "Without a centralized calendar, important registration deadlines slip through. Opportunities vanish before you know it.",
  },
  {
    icon: Users,
    title: "Team Formation Chaos",
    description: "Finding the right teammates is a nightmare. Random group formations lead to mismatched skills and failed projects.",
  },
  {
    icon: AlertCircle,
    title: "Zero Recognition",
    description: "Your participation and achievements are never tracked. No portfolio, no proof, no reputation building.",
  },
];

export const ProblemSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            {/* Clean, bold heading */}
            <motion.h2 
              className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Why Students{" "}
              <span className="text-gradient">Struggle</span>
              {" "}to Succeed
            </motion.h2>
            
            {/* Animated underline */}
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/30 mx-auto rounded-full mb-6"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            
            {/* Interactive subheading */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto group cursor-default"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.span 
                className="relative inline-block"
                whileHover={{ color: "hsl(var(--foreground))" }}
              >
                Students waste hours searching for opportunities while missing critical ones.
                <span className="absolute inset-0 -z-10 bg-primary/0 group-hover:bg-primary/5 blur-xl transition-all duration-500 rounded-lg" />
              </motion.span>
              <br />
              <motion.span 
                className="relative inline-block mt-1"
                whileHover={{ scale: 1.05 }}
              >
                <span className="group-hover:text-primary transition-colors duration-300">It's time for a change.</span>
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </motion.p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <ScrollReveal
              key={problem.title}
              delay={index * 0.1}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <Tilt
                rotationFactor={8}
                springOptions={{ stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <div className="relative group h-full cursor-pointer">
                  {/* Spotlight effect */}
                  <Spotlight 
                    className="from-primary/40 via-primary/20 to-transparent" 
                    size={250}
                  />
                  
                  {/* Animated gradient border - visible on hover */}
                  <motion.div 
                    className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.2) 50%, hsl(var(--primary)) 100%)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Outer glow effect */}
                  <div className="absolute -inset-3 rounded-3xl bg-primary/0 group-hover:bg-primary/15 blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                  
                  {/* Card content */}
                  <div className="relative rounded-2xl p-8 h-full border border-border/30 group-hover:border-transparent transition-all duration-300 bg-card/60 backdrop-blur-xl overflow-hidden">
                    {/* Inner ambient glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating orb */}
                    <motion.div 
                      className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    
                    <div className="relative z-10 flex items-start gap-5">
                      {/* Icon container with glow */}
                      <motion.div 
                        className="relative p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {/* Icon glow ring */}
                        <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/50 blur-xl transition-all duration-500 group-hover:scale-150" />
                        <problem.icon className="relative z-10 h-6 w-6" />
                      </motion.div>
                      
                      <div className="flex-1 space-y-3">
                        {/* Title with underline animation */}
                        <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-300 relative inline-block">
                          <span className="relative z-10">{problem.title}</span>
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500 rounded-full" />
                        </h3>
                        
                        {/* Description with text glow on hover */}
                        <p className="relative text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                          <span className="relative z-10">{problem.description}</span>
                          <span className="absolute inset-0 -z-10 bg-primary/0 group-hover:bg-primary/5 blur-lg rounded-lg transition-all duration-500" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tilt>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};