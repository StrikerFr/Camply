import { useEffect, useRef, useState, useCallback } from 'react';

interface Use3DScrollOptions {
  threshold?: number;
  rootMargin?: string;
  maxRotation?: number;
  scaleFactor?: number;
}

interface ScrollState {
  isInView: boolean;
  progress: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  translateZ: number;
}

export function useScroll3D<T extends HTMLElement = HTMLDivElement>(
  options: Use3DScrollOptions = {}
) {
  const {
    threshold = 0.3,
    rootMargin = '-10% 0px -10% 0px',
    maxRotation = 8,
    scaleFactor = 0.02,
  } = options;

  const ref = useRef<T>(null);
  const [state, setState] = useState<ScrollState>({
    isInView: false,
    progress: 0,
    rotateX: maxRotation,
    rotateY: 0,
    scale: 0.95,
    translateZ: 0,
  });

  const calculateTransforms = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    
    // Calculate how far the element is from center (normalized -1 to 1)
    const distanceFromCenter = (elementCenter - viewportCenter) / (windowHeight / 2);
    const clampedDistance = Math.max(-1, Math.min(1, distanceFromCenter));
    
    // Progress: 0 when far, 1 when at center
    const progress = 1 - Math.abs(clampedDistance);
    
    // Rotation based on position (tilts away when above/below center)
    const rotateX = clampedDistance * maxRotation;
    
    // Scale increases as element approaches center
    const scale = 0.95 + (progress * scaleFactor * 3.5);
    
    // Z translation for depth
    const translateZ = progress * 20;

    setState(prev => ({
      ...prev,
      progress,
      rotateX,
      rotateY: 0,
      scale: Math.min(1.02, scale),
      translateZ,
    }));
  }, [maxRotation, scaleFactor]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setState(prev => ({ ...prev, isInView: entry.isIntersecting }));
          if (entry.isIntersecting) {
            calculateTransforms();
          } else {
            // Reset to initial state when out of view
            setState({
              isInView: false,
              progress: 0,
              rotateX: maxRotation,
              rotateY: 0,
              scale: 0.95,
              translateZ: 0,
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, calculateTransforms, maxRotation]);

  useEffect(() => {
    if (!state.isInView) return;

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(calculateTransforms);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [state.isInView, calculateTransforms]);

  const style: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${state.rotateX}deg) scale(${state.scale}) translateZ(${state.translateZ}px)`,
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  };

  return { ref, state, style };
}
