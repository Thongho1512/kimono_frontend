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
          <path d="M14.103 20.143c-2.629 0-4.547-1.021-4.757-3.751h-.01c-.524.794-1.136 1.391-1.834 1.789-.7.4-1.623.601-2.458.601-1.491 0-2.584-.542-3.28-1.627-.696-1.085-.81-2.74-.12-4.57l.147-.38c.52-1.395 1.582-2.417 3.145-3.027 1.562-.611 3.914-.811 5.48-.811h1.547v-1.1c0-.627-.24-1.168-.718-1.62-.478-.451-1.112-.676-1.904-.676-1.277 0-2.505.341-3.684 1.023l-.149.086c-.218.125-.494.048-.619-.17l-.547-.951c-.13-.226-.05-.515.178-.646l.163-.094c1.613-.934 3.327-1.4 5.14-1.4 1.258 0 2.294.341 3.106 1.023.811.681 1.255 1.63 1.255 2.846v4.618c0 .519.103.953.308 1.303.206.35.539.613.911.787l.149.07c.22.104.307.368.196.577l-.46.868c-.114.215-.373.298-.588.188l-.209-.107c-.456-.234-.844-.555-1.166-1.011-.192.341-.433.633-.722.875-.29.241-.652.434-1.088.58a3.177 3.177 0 0 1-1.253.25zm-4.767-4.48c.162 1.397.896 2.095 2.2 2.095.632 0 1.103-.16 1.412-.48.31-.32.465-.742.465-1.265v-.31h-1.455c-1.556 0-2.235.334-2.622 1.011v.204zm-1.026-3.992c1.393.108 2.375.435 2.943.981.411.396.618.88.618 1.453v.01c0 .022.012.033.036.033h1.597c2.091 0 3.136-.906 3.136-2.719V8.815c0-2.107-1.69-3.161-5.068-3.161H9.992c-2.091 0-3.136.905-3.136 2.716v2.607zm-2.228 1.246c.556 1.47 1.196 2.204 1.918 2.204.42 0 .694-.131.815-.392s.117-.615-.012-1.059l-.027-.087c-.675-2.275-1.062-3.412-1.161-3.412-.132 0-.273.085-.425.253s-.304.408-.456.719l-.652 1.774z" />
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
