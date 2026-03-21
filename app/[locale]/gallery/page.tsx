"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl"; // Added useLocale though strictly not needed unless nav uses it
import { useMessages } from "next-intl"; // Or just standard hooks
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/api";

export const runtime = 'edge';

interface AlbumImageDto {
  id: string;
  url: string;
}

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const tNav = useTranslations("nav");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const [images, setImages] = useState<AlbumImageDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get('/api/public/albums');
        setImages(res.data);
      } catch (error) {
        console.error("Failed to fetch gallery images", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
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
          {images.map((img, i) => (
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
          {images.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              Chưa có hình ảnh nào trong album.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightbox(null);
            if (e.key === "ArrowRight")
              setLightbox((lightbox + 1) % images.length);
            if (e.key === "ArrowLeft")
              setLightbox(
                (lightbox - 1 + images.length) % images.length
              );
          }}
          // biome-ignore lint/a11y/useSemanticElements: lightbox overlay
          role="dialog"
          aria-label="Image lightbox"
          tabIndex={0}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-background hover:text-primary ticktoc-transition z-10"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full">
            <Image
              src={images[lightbox].url || "/placeholder.svg"}
              alt={`Gallery Image ${lightbox + 1}`}
              width={1200}
              height={900}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg animate-scale-fade-in"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </main>
  );
}
