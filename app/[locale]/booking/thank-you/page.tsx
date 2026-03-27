"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone } from "lucide-react";

export default function ThankYouPage() {
  const t = useTranslations("thankYou");
  const locale = useLocale();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="bg-card w-full max-w-2xl rounded-3xl p-8 sm:p-12 ticktoc-shadow border border-border text-center overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-secondary/50 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-green-50 dark:ring-green-900/10">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {t("title")}
                </h2>
                
                <div className="space-y-4 mb-8 text-muted-foreground text-sm sm:text-base">
                  <p>
                    {t("subtitle")}
                  </p>
                  <p>
                    {t("message")}
                  </p>
                  <div className="bg-secondary/30 p-4 rounded-xl border border-border inline-block w-full max-w-sm mx-auto mt-4 text-left">
                    <p className="font-semibold text-foreground mb-1">{t("nextSteps")}</p>
                    <p className="text-sm">{t("contactSupport")}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-md">
                    <Link href={`/${locale}`}>{t("backHome")}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8">
                    <Link href={`/${locale}/gallery`}>{t("viewGallery")}</Link>
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
