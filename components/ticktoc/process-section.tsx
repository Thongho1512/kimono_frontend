"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "./fade-in";
import { CalendarCheck, Shirt, Scissors, Camera } from "lucide-react";

const steps = [
  { icon: CalendarCheck, key: "step1" },
  { icon: Shirt, key: "step2" },
  { icon: Scissors, key: "step3" },
  { icon: Camera, key: "step4" },
];

export function ProcessSection() {
  const t = useTranslations("process");

  return (
    <section className="py-20 lg:py-28 px-4">
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
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.key} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative text-center"
                >
                  {/* Step number */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-5">
                    <Icon className="h-8 w-8 text-primary" />
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  {/* Connector line (hidden on last) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                  )}

                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {t(`${step.key}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${step.key}Desc`)}
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
