"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "./fade-in";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, MapPin } from "lucide-react";

export function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <section className="py-20 lg:py-28 px-4 bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <FadeIn direction="left">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden ticktoc-shadow"
              >
                <Image
                  src="/images/shop-interior.jpg"
                  alt={t("imageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </motion.div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-4 -right-4 lg:-right-6 bg-card rounded-xl p-4 ticktoc-shadow border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">5,000+</p>
                    <p className="text-xs text-muted-foreground">{t("happyCustomers")}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeIn>

          {/* Content side */}
          <FadeIn direction="right" delay={0.15}>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-accent uppercase tracking-wider">
                  {t("badge")}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight text-balance">
                {t("title")}
              </h2>

              <p className="text-muted-foreground leading-relaxed text-pretty">
                {t("p1")}
              </p>

              <p className="text-muted-foreground leading-relaxed text-pretty">
                {t("p2")}
              </p>

              <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">{t("locationLabel")}</p>
                  <p className="text-sm text-muted-foreground">{t("locationValue")}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`${prefix}/plans`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {t("explorePlans")}
                  </Button>
                </Link>
                <Link href={`${prefix}/gallery`}>
                  <Button variant="outline" className="bg-transparent">
                    {t("viewGallery")}
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
