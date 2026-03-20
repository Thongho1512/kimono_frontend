"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "./fade-in";

const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ"; // Replace with your actual YouTube video ID

export function VideoSection() {
  const t = useTranslations("video");
  const locale = useLocale();
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-20 lg:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary mb-4">
              {t("badge")}
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground lg:text-4xl text-balance">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-video overflow-hidden rounded-2xl ticktoc-shadow">
              {!playing ? (
                <div className="relative h-full w-full cursor-pointer group" onClick={() => setPlaying(true)}>
                  {/* YouTube Thumbnail */}
                  <Image
                    src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                    alt={t("thumbnailAlt")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/20 ticktoc-transition" />
                  {/* Play button */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl backdrop-blur-sm"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                    >
                      <Play className="h-8 w-8 ml-1" fill="currentColor" />
                    </motion.div>
                  </motion.div>
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-6">
                    <p className="text-sm font-medium text-white/90">{t("caption")}</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&hl=${locale}`}
                  title={t("title")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
