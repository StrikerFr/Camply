import { useScroll3D } from '@/hooks/use-scroll-3d';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Card3DProps {
  index: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function Card3D({ index, icon: Icon, title, description }: Card3DProps) {
  const isMobile = useIsMobile();
  const { ref, state, style } = useScroll3D<HTMLDivElement>({
    maxRotation: isMobile ? 3 : 8,
    scaleFactor: isMobile ? 0.01 : 0.02,
  });

  // Calculate dynamic shadow based on state
  const shadowIntensity = state.progress * 0.4;
  const shadowBlur = 20 + state.progress * 30;
  const shadowSpread = state.progress * 10;

  return (
    <div
      ref={ref}
      className="relative group h-full"
      style={isMobile ? {} : style}
    >
      {/* Step Number Badge */}
      <div className="absolute -top-3 -left-3 z-20">
        <div 
          className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold transition-all duration-300"
          style={{
            boxShadow: state.isInView 
              ? `0 0 ${15 + state.progress * 10}px hsl(var(--primary) / ${0.3 + shadowIntensity})`
              : '0 0 15px hsl(var(--primary) / 0.3)',
          }}
        >
          {index + 1}
        </div>
      </div>

      {/* Card */}
      <div
        className={cn(
          "relative h-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300",
          "hover:border-primary/40",
          state.isInView && "border-primary/20"
        )}
        style={{
          boxShadow: state.isInView
            ? `0 ${10 + shadowSpread}px ${shadowBlur}px -10px hsl(var(--primary) / ${shadowIntensity * 0.3}), 
               0 ${5 + shadowSpread / 2}px ${shadowBlur / 2}px -5px hsl(var(--background) / 0.8),
               inset 0 1px 0 hsl(var(--primary) / ${state.progress * 0.1})`
            : '0 10px 20px -10px hsl(var(--background) / 0.5)',
          background: state.isInView
            ? `linear-gradient(135deg, hsl(var(--card) / ${0.5 + state.progress * 0.3}), hsl(var(--card) / 0.5))`
            : undefined,
        }}
      >
        {/* Gradient border effect */}
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none transition-opacity duration-500"
          style={{ opacity: state.progress * 0.8 }}
        />

        {/* Inner glow */}
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / ${state.progress * 0.08}), transparent 70%)`,
            opacity: state.isInView ? 1 : 0,
          }}
        />

        <div className="relative z-10 pt-2">
          {/* Icon Container */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-all duration-300",
              state.isInView && "bg-primary/15"
            )}
            style={{
              boxShadow: state.isInView
                ? `0 0 ${20 * state.progress}px hsl(var(--primary) / ${state.progress * 0.3})`
                : 'none',
              transform: state.isInView ? `translateZ(${state.translateZ * 0.5}px)` : 'none',
            }}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* Title */}
          <h3 
            className={cn(
              "text-lg font-display font-semibold text-foreground mb-2 transition-all duration-300",
              state.isInView && state.progress > 0.5 && "text-primary"
            )}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
