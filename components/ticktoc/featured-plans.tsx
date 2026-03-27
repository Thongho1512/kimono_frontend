"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { formatJPY } from "@/lib/data";
import { FadeIn } from "./fade-in";

export function FeaturedPlans() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get(`/api/public/products?culture=${locale}`);
        if (res.data) {
          // Take first 4 as featured, or filter if backend adds a flag later
          setPlans(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch featured plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [locale]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mt-10" />
        <p className="mt-4 text-muted-foreground text-sm italic">Đang tải gói thuê nổi bật...</p>
      </div>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground text-balance">
              {t("featured.title")}
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              {t("featured.subtitle")}
            </p>
            <div className="sakura-line max-w-32 mx-auto mt-5" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.1}>
              <Link href={`${prefix}/plans/${plan.slug}`} className="group block h-full">
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-xl overflow-hidden ticktoc-shadow border border-border group-hover:border-primary/30 ticktoc-transition h-full flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={plan.images?.[0]?.url || "/images/shop-interior.jpg"}
                      alt={plan.name}
                      fill
                      className="object-cover group-hover:scale-110 ticktoc-transition"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Price badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-primary text-sm font-bold">
                        {t("featured.from")} {formatJPY(plan.rentalPriceMin || plan.rentalPricePerDay)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary ticktoc-transition uppercase tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1 italic">
                      {plan.description || t("featured.noDescription")}
                    </p>
                    <div className="mt-3 flex items-center justify-end">
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1 group-hover:text-primary ticktoc-transition font-bold">
                        {t("featured.details")}
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 ticktoc-transition" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="text-center mt-12">
            <Link
              href={`${prefix}/plans`}
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 group font-medium text-sm sm:text-base shadow-sm hover:shadow-lg"
            >
              {t("common.viewAll")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
