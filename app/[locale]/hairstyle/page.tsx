"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Metadata } from "next";
import { getSeoContent } from "@/lib/seo-registry";

interface HairStyleDto {
  id: string;
  name: string;
  url: string;
  description: string;
}

export default function HairstylePage() {
  const t = useTranslations("hairstyle");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [styles, setStyles] = useState<HairStyleDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await api.get(`/api/public/hair-styles?culture=${locale}`);
        setStyles(res.data);
      } catch (error) {
        console.error("Failed to fetch hairstyles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStyles();
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
          {styles.map((style, i) => (
            <FadeIn key={style.id} delay={i * 0.05}>
              <div className="bg-card rounded-xl overflow-hidden ticktoc-shadow border border-border group">
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
          {styles.length === 0 && (
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
      </div>
    </main>
  );
}
