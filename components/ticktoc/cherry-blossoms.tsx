"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export function CherryBlossoms() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 8 + Math.random() * 10,
      rotation: Math.random() * 360,
    }));
    setPetals(generated);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -20,
            width: petal.size,
            height: petal.size,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, Math.sin(petal.id) * 60, Math.cos(petal.id) * 40, 0],
            rotate: [petal.rotation, petal.rotation + 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-full h-full opacity-40">
            <path
              d="M10 2C10 2 7 5 7 8C7 10 8.5 11 10 11C11.5 11 13 10 13 8C13 5 10 2 10 2Z"
              fill="#C4727F"
            />
            <path
              d="M5 6C5 6 5 9 6.5 10.5C7.5 11.5 9 11 9.5 10C10 9 9 7.5 8 7C6.5 6 5 6 5 6Z"
              fill="#C4727F"
              opacity="0.8"
            />
            <path
              d="M15 6C15 6 15 9 13.5 10.5C12.5 11.5 11 11 10.5 10C10 9 11 7.5 12 7C13.5 6 15 6 15 6Z"
              fill="#C4727F"
              opacity="0.8"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
