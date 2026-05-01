import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface DrawerStack3DProps {
  steps: Step[];
}

export function DrawerStack3D({ steps }: DrawerStack3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto"
      style={{ 
        perspective: '1500px',
        perspectiveOrigin: 'center center'
      }}
    >
      <div className="relative py-8">
        {steps.map((step, index) => (
          <DrawerCard
            key={step.title}
            step={step}
            index={index}
            totalSteps={steps.length}
            scrollProgress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}

interface DrawerCardProps {
  step: Step;
  index: number;
  totalSteps: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  isMobile: boolean;
}

function DrawerCard({ step, index, totalSteps, scrollProgress, isMobile }: DrawerCardProps) {
  const Icon = step.icon;
  
  // Smoother animation ranges with more overlap
  const startRange = index / (totalSteps + 3);
  const midRange = (index + 1.5) / (totalSteps + 3);
  const endRange = (index + 3) / (totalSteps + 3);
  
  // Smoother slide with eased curve
  const x = useTransform(
    scrollProgress,
    [startRange, midRange, endRange],
    isMobile ? [150, 20, 0] : [300, 30, 0]
  );
  
  // Gentler rotation
  const rotateY = useTransform(
    scrollProgress,
    [startRange, midRange, endRange],
    isMobile ? [-10, -2, 0] : [-18, -3, 0]
  );
  
  // Subtle vertical movement for floating feel
  const y = useTransform(
    scrollProgress,
    [startRange, midRange, endRange],
    [30, 5, 0]
  );
  
  // Smoother scale
  const scale = useTransform(
    scrollProgress,
    [startRange, midRange, endRange],
    [0.92, 0.98, 1]
  );
  
  // Gradual opacity with longer fade in
  const opacity = useTransform(
    scrollProgress,
    [startRange, startRange + 0.08, midRange],
    [0, 0.7, 1]
  );

  return (
    <motion.div
      className="relative mb-6"
      initial={{ opacity: 0, x: 100, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        x,
        y,
        rotateY,
        scale,
        opacity,
        transformStyle: 'preserve-3d',
        transformOrigin: 'left center',
      }}
    >
      {/* Main Card */}
      <motion.div
        className={cn(
          "relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6",
          "transition-all duration-500 ease-out hover:border-primary/40"
        )}
        style={{
          boxShadow: `
            0 10px 40px -10px hsl(var(--primary) / 0.15),
            0 0 0 1px hsl(var(--primary) / 0.05),
            inset 0 1px 0 hsl(var(--primary) / 0.1)
          `,
        }}
        whileHover={{
          scale: 1.02,
          y: -4,
          boxShadow: `
            0 25px 70px -15px hsl(var(--primary) / 0.3),
            0 0 0 1px hsl(var(--primary) / 0.25),
            inset 0 1px 0 hsl(var(--primary) / 0.2)
          `,
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        }}
      >
        {/* Step Number Badge */}
        <div className="absolute -top-3 -left-3 z-20">
          <div 
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold"
            style={{
              boxShadow: '0 0 20px hsl(var(--primary) / 0.4)',
            }}
          >
            {index + 1}
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none opacity-60" />

        {/* Inner glow */}
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08), transparent 70%)',
          }}
        />

        <div className="relative z-10 flex items-start gap-4 pt-2">
          {/* Icon Container */}
          <div
            className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
            style={{
              boxShadow: '0 0 20px hsl(var(--primary) / 0.2)',
            }}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="flex-1">
            {/* Title */}
            <h3 className="text-lg font-display font-semibold text-foreground mb-1">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>

        {/* 3D edge effect - right side */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-2 rounded-r-xl pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent, hsl(var(--primary) / 0.1))',
            transform: 'translateZ(-5px)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
