"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BadgeDollarSign, Sparkles, Zap, Shield } from "lucide-react";
import { FadeIn } from "./fade-in";

const icons = [BadgeDollarSign, Sparkles, Zap, Shield];
const keys = ["price", "variety", "service", "quality"];

export function WhyUs() {
  const t = useTranslations("whyUs");

  return (
    <section className="py-20 lg:py-28 px-4 bg-secondary">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground text-balance">
              {t("title")}
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              {t("subtitle")}
            </p>
            <div className="sakura-line max-w-32 mx-auto mt-5" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <FadeIn key={key} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="text-center bg-card rounded-xl p-6 ticktoc-shadow border border-border"
                >
                  <motion.div
                    whileHover={{ rotate: 12 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {t(key)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${key}Desc`)}
                  </p>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
