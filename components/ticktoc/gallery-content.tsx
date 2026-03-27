"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef, useCallback } from "react";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import dynamic from "next/dynamic";
import api from "@/lib/api";

const Lightbox = dynamic(() => import("@/components/ticktoc/lightbox").then(m => m.Lightbox), { ssr: false });

interface AlbumImageDto {
  id: string;
  url: string;
}

interface PagedResult {
  items: AlbumImageDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface GalleryContentProps {
  initialData: PagedResult;
}

export function GalleryContent({ initialData }: GalleryContentProps) {
  const t = useTranslations("gallery");
  const tNav = useTranslations("nav");
  const [images, setImages] = useState<AlbumImageDto[]>(initialData.items);
  const [page, setPage] = useState(initialData.page);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.items.length < initialData.totalCount);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchMoreImages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await api.get<PagedResult>(`/api/public/albums`, {
        params: { page: nextPage, pageSize: 12 }
      });
      const newItems = res.data.items;
      setImages((prev: AlbumImageDto[]) => [...prev, ...newItems]);
      setPage(nextPage);
      setHasMore(images.length + newItems.length < res.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch more gallery images", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, images.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMoreImages();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMoreImages, hasMore, loading]);

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
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 pb-8">
        {images.map((img, i) => (
          <FadeIn key={img.id} delay={0.05}>
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
                priority={i < 4}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 ticktoc-transition rounded-xl" />
            </button>
          </FadeIn>
        ))}
      </div>

      {loading && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 pb-8">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="mb-4 w-full h-64 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {!loading && hasMore && (
        <div ref={observerRef} className="h-10 w-full" />
      )}

      {images.length === 0 && !loading && (
        <div className="text-center text-muted-foreground py-20">
          {t("noImages") || "Chưa có hình ảnh nào trong album."}
        </div>
      )}

      <div className="pb-16" />

      {lightbox !== null && images[lightbox] && (
        <Lightbox 
          images={images.map((img: AlbumImageDto) => img.url)} 
          currentIndex={lightbox} 
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox((lightbox - 1 + images.length) % images.length)}
          onNext={() => setLightbox((lightbox + 1) % images.length)}
        />
      )}
    </div>
  );
}
