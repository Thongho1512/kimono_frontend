"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./fade-in";

export function CTABanner() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      <Image
        src="/images/shop-interior.jpg"
        alt="Ticktoc Kimono Rental shop interior"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-foreground/65" />

      {/* Decorative sakura */}
      <div className="absolute top-0 left-0 right-0 h-px sakura-line opacity-50" />
      <div className="absolute bottom-0 left-0 right-0 h-px sakura-line opacity-50" />

      <div className="relative z-10 mx-auto max-w-3xl text-center px-4">
        <FadeIn>
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-5xl font-bold text-background text-balance leading-tight">
              {t("hero.title")}
            </h2>
            <p className="mt-5 text-background/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <Link href={`${prefix}/booking`}>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-lg"
                >
                  {t("hero.cta")}
                </Button>
              </Link>
              <Link href={`${prefix}/gallery`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-background/50 text-background hover:bg-background/10 hover:text-background bg-transparent"
                >
                  {t("gallery.title")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
