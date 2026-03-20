"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "./fade-in";

// Two YouTube video IDs - replace with your actual IDs
const VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "Shop Tour" },
  { id: "jNQXAC9IVRw", title: "Rental Experience" }
];

export function VideosSection() {
  const t = useTranslations("videos");
  const locale = useLocale();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

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

        {/* Two Videos Grid */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {VIDEOS.map((video, idx) => (
              <VideoCard
                key={video.id}
                video={video}
                isPlaying={playingIndex === idx}
                onPlay={() => setPlayingIndex(idx)}
                locale={locale}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function VideoCard({
  video,
  isPlaying,
  onPlay,
  locale
}: {
  video: typeof VIDEOS[0];
  isPlaying: boolean;
  onPlay: () => void;
  locale: string;
}) {
  const t = useTranslations("videos");

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl ticktoc-shadow">
      {!isPlaying ? (
        <div className="relative h-full w-full cursor-pointer group" onClick={onPlay}>
          {/* YouTube Thumbnail */}
          <Image
            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
            alt={`${video.title} video`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 448px"
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
            <p className="text-sm font-medium text-white/90">{video.title}</p>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&hl=${locale}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
