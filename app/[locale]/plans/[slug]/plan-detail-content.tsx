"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { formatJPY } from "@/lib/data";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Sparkles, ArrowLeft } from "lucide-react";

interface ProductDto {
    id: string;
    categoryId: string;
    categoryName?: string;
    categoryNameTranslated?: string;
    name: string;
    slug: string;
    rentalPricePerDay: number;
    rentalPriceMin: number;
    rentalPriceMax: number;
    priceType: string;
    imageUrl?: string;
    ImageUrl?: string;
    images?: { url: string }[];
    description?: string;
}

export default function PlanDetailContent({
    plan,
    locale,
    relatedPlans
}: {
    plan: ProductDto,
    locale: string,
    relatedPlans: ProductDto[]
}) {
    const t = useTranslations("plans");
    const tNav = useTranslations("nav");
    const tPricing = useTranslations("pricing");
    const tCommon = useTranslations("common");

    const formatPrice = (p: ProductDto) => {
        const isRange = p.priceType === "range" || p.priceType === "Khoảng";
        if (isRange) {
          return `${formatJPY(p.rentalPriceMin)} - ${formatJPY(p.rentalPriceMax)}`;
        }
        return formatJPY(p.rentalPriceMin > 0 ? p.rentalPriceMin : p.rentalPricePerDay);
    };

    const mainImageUrl = plan.imageUrl || plan.ImageUrl || plan.images?.[0]?.url || "/placeholder.svg";
    const categoryDisplayName = plan.categoryNameTranslated || plan.categoryName;

    return (
        <div className="pb-16">
            {/* Breadcrumb */}
            <PageBreadcrumb
                items={[
                    { label: tNav("plans"), href: `/${locale}/plans` },
                    { label: plan.name },
                ]}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image */}
                <FadeIn direction="left">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden ticktoc-shadow border border-border">
                        <Image
                            src={mainImageUrl}
                            alt={plan.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </FadeIn>

                {/* Details */}
                <FadeIn direction="right" delay={0.1}>
                    <div className="flex flex-col justify-center">
                        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
                            {categoryDisplayName ? `${categoryDisplayName} - ` : ''}{plan.name}
                        </h1>

                        <div className="mt-8 p-6 bg-secondary rounded-2xl border border-primary/10">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">
                                    {formatPrice(plan)}
                                </span>
                                <span className="text-base text-muted-foreground">
                                    / {tPricing("rentalPlan")}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="flex-1 text-lg h-14">
                                <Link href={`/${locale}/booking?plan=${plan.id}`}>
                                    {t("bookNow")}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent text-lg h-14">
                                <Link href={`/${locale}/pricing`}>
                                    {tPricing("title")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Related Plans */}
            {relatedPlans.length > 0 && (
                <section className="mt-16">
                    <FadeIn>
                        <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                            {t("title")}
                        </h2>
                    </FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedPlans.map((rp, idx) => {
                            const rpImageUrl = rp.imageUrl || rp.ImageUrl || rp.images?.[0]?.url || "/placeholder.svg";
                            return (
                                <FadeIn key={rp.id} delay={idx * 0.05}>
                                    <Link
                                        href={`/${locale}/plans/${rp.slug || rp.id}`}
                                        className="group block"
                                    >
                                        <div className="bg-card rounded-xl overflow-hidden ticktoc-shadow border border-border hover:border-primary/30 ticktoc-transition">
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={rpImageUrl}
                                                    alt={rp.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 ticktoc-transition"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary ticktoc-transition">
                                                    {rp.name}
                                                </h3>
                                                <span className="text-primary font-bold mt-1 block">
                                                    {formatPrice(rp)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeIn>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Back */}
            <FadeIn delay={0.2}>
                <div className="mt-10">
                    <Button variant="ghost" asChild>
                        <Link
                            href={`/${locale}/plans`}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {tCommon("back")}
                        </Link>
                    </Button>
                </div>
            </FadeIn>
        </div>
    );
}
