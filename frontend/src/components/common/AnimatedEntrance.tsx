import { useEffect, useRef, type PropsWithChildren } from "react";
import { animate, stagger } from "animejs";

export function AnimatedEntrance({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return;
    animate(element.current.children, {
      opacity: [0, 1], translateY: [12, 0], delay: stagger(65), duration: 480, ease: "out(3)",
    });
  }, []);
  return <div ref={element} className={className}>{children}</div>;
}
