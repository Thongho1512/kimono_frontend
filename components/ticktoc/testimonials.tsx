"use client";

import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { FadeIn } from "./fade-in";

export function Testimonials() {
  const t = useTranslations("testimonials");

  // Duplicate testimonials 3x for seamless infinite horizontal loop
  const scrollItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 mb-12">
        <FadeIn>
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground text-balance">
              {t("title")}
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              {t("subtitle")}
            </p>
            <div className="sakura-line max-w-32 mx-auto mt-5" />
          </div>
        </FadeIn>
      </div>

      {/* Single Horizontal Scrolling Row */}
      <div className="scroll-marquee-container">
        <div className="scroll-marquee-row scroll-marquee-row-medium">
          {scrollItems.map((item, i) => (
            <TestimonialCard key={`testimonial-${i}`} item={item} />
          ))}
          {/* Duplicate for seamless loop (total 2x for smooth infinite) */}
          {scrollItems.map((item, i) => (
            <TestimonialCard key={`testimonial-dup-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* User tip */}
      <p className="text-xs text-muted-foreground text-center mt-8 px-4">
        💡 Hover over any testimonial to pause and read
      </p>
    </section>
  );
}

function TestimonialCard({
  item,
}: {
  item: (typeof testimonials)[0];
}) {
  return (
    <div className="testimonial-card bg-card rounded-lg p-5 ticktoc-shadow border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <Quote className="h-5 w-5 text-primary/20 mb-2" />
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: item.rating }).map((_, s) => (
          <Star
            key={s}
            className="h-3.5 w-3.5 fill-accent text-accent"
          />
        ))}
      </div>
      <p className="text-xs sm:text-sm text-foreground leading-relaxed mb-3 italic">
        {`"${item.text}"`}
      </p>
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {item.avatar}
        </div>
        <span className="text-xs sm:text-sm font-semibold text-foreground">
          {item.name}
        </span>
      </div>
    </div>
  );
}

