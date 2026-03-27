"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/ticktoc/lightbox").then(m => m.Lightbox), { ssr: false });

interface HairStyleDto {
  id: string;
  name: string;
  url: string;
  description: string;
}

interface HairstyleContentProps {
  initialStyles: HairStyleDto[];
}

export function HairstyleContent({ initialStyles }: HairstyleContentProps) {
  const t = useTranslations("hairstyle");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <PageBreadcrumb items={[{ label: tNav("hairstyle") }]} />

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
        {initialStyles.map((style, i) => (
          <FadeIn key={style.id} delay={i * 0.05}>
            <div 
              className="bg-card rounded-xl overflow-hidden ticktoc-shadow border border-border group cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={style.url || "/placeholder.svg"}
                  alt={style.name || style.description || "Hairstyle"}
                  fill
                  className="object-cover group-hover:scale-105 ticktoc-transition"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground text-center">
                  {style.name || style.description || "Mẫu tóc đẹp"}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
        {initialStyles.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            Chưa có mẫu tóc nào được cập nhật.
          </div>
        )}
      </div>

      <FadeIn delay={0.3}>
        <div className="text-center pb-16">
          <Button asChild size="lg">
            <Link href={`/${locale}/booking`}>{tCommon("bookNow")}</Link>
          </Button>
        </div>
      </FadeIn>

      {lightboxIndex !== null && initialStyles[lightboxIndex] && (
        <Lightbox 
          images={initialStyles.map(s => s.url)} 
          currentIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + initialStyles.length) % initialStyles.length)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % initialStyles.length)}
        />
      )}
    </div>
  );
}
