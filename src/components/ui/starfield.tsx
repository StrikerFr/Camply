"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface StarfieldProps {
  starCount?: number;
  className?: string;
}

export const Starfield: React.FC<StarfieldProps> = ({
  starCount = 150,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate stars with random properties - subtle twinkling
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.2,
      twinkleSpeed: Math.random() * 0.003 + 0.001, // Much slower twinkling
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let animationId: number;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Subtle twinkling - very gentle opacity variation
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity + twinkle * 0.1; // Reduced variation

        // Draw star with glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Create radial gradient for glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, currentOpacity)})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${Math.max(0, currentOpacity * 0.3)})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, currentOpacity)})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full absolute inset-0", className)}
    />
  );
};
