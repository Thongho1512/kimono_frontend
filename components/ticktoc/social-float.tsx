"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import api from "@/lib/api";

export function SocialFloat() {
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const locale = useLocale();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/api/public/shop-info?culture=${locale}`);
        if (res.data) setStoreInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch shop info for SocialFloat", err);
      }
    };
    fetchInfo();
  }, [locale]);

  if (!storeInfo) return null;

  const socialItems = [
    {
      label: "Facebook",
      href: storeInfo.urlFacebook || null,
      color: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: storeInfo.urlTiktok || null,
      color: "#010101",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.22 8.22 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.12z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: storeInfo.urlInstagram || null,
      color: "#E4405F",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    {
      label: "Threads",
      href: storeInfo.urlThreads || null,
      color: "#000000",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M15.424 0c-.815 0-1.472.657-1.472 1.472 0 .816.657 1.472 1.472 1.472h1.472c1.626 0 2.943 1.317 2.943 2.943v1.472c0 .816.657 1.472 1.472 1.472s1.472-.656 1.472-1.472V5.887C22.784 2.641 20.143 0 16.897 0h-1.473zm-3.424 5.887c-3.38 0-6.132 2.753-6.132 6.132 0 3.379 2.752 6.132 6.132 6.132 3.379 0 6.132-2.753 6.132-6.132 0-3.379-2.753-6.132-6.132-6.132zm0 2.453c2.032 0 3.679 1.647 3.679 3.679 0 2.032-1.647 3.679-3.679 3.679-2.032 0-3.679-1.647-3.679-3.679 0-2.032 1.647-3.679 3.679-3.679zM1.472 0C.656 0 0 .657 0 1.472 0 2.288.656 2.944 1.472 2.944h1.472C4.57 2.944 5.887 4.26 5.887 5.887V7.36c0 .815.656 1.472 1.472 1.472s1.472-.657 1.472-1.472V5.887C8.831 2.641 6.19 0 2.944 0H1.472zm21.056 15.17c-.815 0-1.472.657-1.472 1.472v1.472c0 1.626-1.317 2.943-2.943 2.943h-1.472c-.815 0-1.472.657-1.472 1.472 0 .816.657 1.472 1.472 1.472h1.472c3.246 0 5.887-2.641 5.887-5.887v-1.472c0-.816-.657-1.472-1.472-1.472zM7.359 21.056c-.816 0-1.472.657-1.472 1.472 0 .816.656 1.472 1.472 1.472h1.472c3.246 0 5.887-2.641 5.887-5.887v-1.472c0-.816-.657-1.472-1.472-1.472s-1.472.656-1.472 1.472v1.472c0 1.626-1.317 2.943-2.943 2.943h-1.472z" />
        </svg>
      ),
    },
    {
      label: "Youtube",
      href: storeInfo.urlYoutube || null,
      color: "#FF0000",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ].filter(s => s.href);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {socialItems.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href!}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.4, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.4, x: 20 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 22 }}
            className="group pointer-events-auto relative flex items-center"
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
    </div>
  );
}
