"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/ticktoc/lightbox").then(m => m.Lightbox), { ssr: false });

interface AlbumImageDto {
  id: string;
  url: string;
}

interface GalleryContentProps {
  initialImages: AlbumImageDto[];
}

export function GalleryContent({ initialImages }: GalleryContentProps) {
  const t = useTranslations("gallery");
  const tNav = useTranslations("nav");
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <PageBreadcrumb items={[{ label: tNav("gallery") }]} />

      <FadeIn>
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t("subtitle")}
          </p>
          <div className="sakura-line mt-6 mx-auto w-32" />
        </div>
      </FadeIn>

      {/* Masonry-like Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 pb-16">
        {initialImages.map((img, i) => (
          <FadeIn key={img.id} delay={i * 0.04}>
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="mb-4 w-full block relative overflow-hidden rounded-xl group cursor-pointer"
            >
              <Image
                src={img.url || "/placeholder.svg"}
                alt={`Gallery Image ${i + 1}`}
                width={600}
                height={i % 3 === 0 ? 800 : i % 3 === 1 ? 600 : 700}
                className="w-full h-auto object-cover group-hover:scale-105 ticktoc-transition rounded-xl"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 ticktoc-transition rounded-xl" />
            </button>
          </FadeIn>
        ))}
        {initialImages.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            Chưa có hình ảnh nào trong album.
          </div>
        )}
      </div>

      {lightbox !== null && initialImages[lightbox] && (
        <Lightbox 
          images={initialImages.map(img => img.url)} 
          currentIndex={lightbox} 
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox((lightbox - 1 + initialImages.length) % initialImages.length)}
          onNext={() => setLightbox((lightbox + 1) % initialImages.length)}
        />
      )}
    </div>
  );
}
