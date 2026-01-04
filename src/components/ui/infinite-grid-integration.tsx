import React, { useState, useRef } from 'react';
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";
import { MousePointerClick, Info, Settings2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface GridPatternProps {
  offsetX: number;
  offsetY: number;
  size: number;
  color?: string;
}

const GridPattern = ({ offsetX, offsetY, size, color = "currentColor" }: GridPatternProps) => {
  return (
    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id={`grid-${color.replace('#', '')}`}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${offsetX} ${offsetY})`}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${color.replace('#', '')})`} />
    </svg>
  );
};

interface InfiniteGridProps {
  className?: string;
  showControls?: boolean;
  title?: string;
  subtitle?: string;
}

const InfiniteGrid = ({ 
  className, 
  showControls = true,
  title = "The Infinite Grid",
  subtitle = "Move your cursor to reveal the active grid layer. The pattern scrolls infinitely in the background."
}: InfiniteGridProps) => {
  const [count, setCount] = useState(0);
  const [gridSize, setGridSize] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full min-h-screen overflow-hidden bg-background",
        className
      )}
    >
      {/* Layer 1: Subtle background grid (always visible) */}
      <div className="absolute inset-0 text-muted-foreground/20">
        <motion.div
          className="absolute inset-0"
          style={{
            x: gridOffsetX,
            y: gridOffsetY,
          }}
        >
          <GridPattern offsetX={0} offsetY={0} size={gridSize} color="hsl(var(--muted-foreground))" />
        </motion.div>
      </div>

      {/* Layer 2: Highlighted grid (revealed by mouse mask) */}
      <motion.div
        className="absolute inset-0 text-primary"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            x: gridOffsetX,
            y: gridOffsetY,
          }}
        >
          <GridPattern offsetX={0} offsetY={0} size={gridSize} color="hsl(var(--primary))" />
        </motion.div>
      </motion.div>

      {/* Decorative Blur Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Density Control Panel */}
      {showControls && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Grid Density</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Dense</span>
              <span>Sparse ({gridSize}px)</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 font-display">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            onClick={() => setCount(count + 1)}
            whileHover={{
              scale: 1.05,
              y: -4,
            }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transition-shadow"
          >
            <MousePointerClick className="h-5 w-5" />
            Interact ({count})
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              y: -4,
            }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transition-shadow"
          >
            <Info className="h-5 w-5" />
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default InfiniteGrid;
