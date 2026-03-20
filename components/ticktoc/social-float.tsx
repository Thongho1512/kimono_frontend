"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const socials = [
  {
    label: "Zalo",
    href: "https://zalo.me/0901234567",
    color: "#0068FF",
    icon: (
      <svg viewBox="0 0 48 48" className="h-6 w-6" fill="currentColor">
        <path d="M12.5 6C8.91 6 6 8.91 6 12.5v23C6 39.09 8.91 42 12.5 42h23c3.59 0 6.5-2.91 6.5-6.5v-23C42 8.91 39.09 6 35.5 6h-23zm11.3 8c6.08 0 11.01 4.18 11.01 9.34 0 1.74-.56 3.38-1.56 4.82-.14.2-.2.45-.15.7l.63 2.82c.08.34-.26.63-.58.5l-2.6-1.04a1.2 1.2 0 0 0-.86-.02c-1.81.7-3.82 1.08-5.9 1.08-6.07 0-11-4.18-11-9.34S17.73 14 23.8 14zM18 19c-.55 0-1 .45-1 1s.45 1 1 1h2.44l-3.2 4.48c-.22.3-.24.7-.06 1.03.18.33.53.49.88.49H23c.55 0 1-.45 1-1s-.45-1-1-1h-2.44l3.2-4.48c.22-.3.24-.7.06-1.03A1.01 1.01 0 0 0 23 19h-5zm10.66 0c-.42 0-.8.27-.94.67L25.58 26c-.19.54.2 1 .72 1 .34 0 .65-.21.78-.53l.32-.87h2.86l.32.87c.13.32.44.53.78.53.52 0 .91-.46.72-1l-2.14-6.33a1.01 1.01 0 0 0-.94-.67h-.34zM29 21.46l.86 2.34h-1.72L29 21.46z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/ticktockimono",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@ticktockimono",
    color: "#010101",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.22 8.22 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/ticktockimono",
    color: "#E4405F",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

export function SocialFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.4, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.4, y: 20 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 22 }}
              className="group relative flex items-center"
              aria-label={s.label}
            >
              {/* Tooltip */}
              <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 group-hover:opacity-100 ticktoc-transition pointer-events-none">
                {s.label}
              </span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ticktoc-transition hover:scale-110"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ticktoc-transition hover:bg-primary/90"
        whileTap={{ scale: 0.9 }}
        aria-label={open ? "Close social links" : "Open social links"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
