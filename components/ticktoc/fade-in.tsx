"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
}: FadeInProps) {
  // Using simple CSS animations instead of framer-motion to reduce Edge bundle size
  return (
    <div
      className={cn(
        "animate-in fade-in duration-700 fill-mode-both",
        direction === "up" && "slide-in-from-bottom-6",
        direction === "down" && "slide-in-from-top-6",
        direction === "left" && "slide-in-from-right-6",
        direction === "right" && "slide-in-from-left-6",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
