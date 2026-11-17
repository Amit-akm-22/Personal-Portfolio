import { motion, useInView, useAnimation } from 'framer-motion';
import type { ReactNode, ElementType } from 'react';
import { useRef, useEffect } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

const FadeIn = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className,
  style,
}: FadeInProps) => {
  const MotionComponent = motion.create(as as ElementType);
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  // amount:0 means trigger as soon as ANY part enters view
  const isInView = useInView(ref, { once: true, amount: 0, margin: '0px 0px -50px 0px' });

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, x: 0, y: 0 });
    }
  }, [isInView, controls]);

  // Fallback: if element never enters view within 1.5s (e.g. already on screen but
  // IntersectionObserver fired before content was mounted), force animate it in.
  useEffect(() => {
    const timer = setTimeout(() => {
      controls.start({ opacity: 1, x: 0, y: 0 });
    }, 1500 + delay * 1000);
    return () => clearTimeout(timer);
  }, [controls, delay]);

  return (
    <MotionComponent
      ref={ref}
      animate={controls}
      initial={{ opacity: 0, x, y }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
};

export default FadeIn;
