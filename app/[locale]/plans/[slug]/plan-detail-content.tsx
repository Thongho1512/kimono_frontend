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
    name: string;
    slug: string;
    rentalPricePerDay: number;
    rentalPriceMin: number;
    rentalPriceMax: number;
    priceType: string;
    images: { url: string }[];
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

    const includesList = (plan.description || "").split(",").map((s) => s.trim());

    const formatPrice = (p: ProductDto) => {
        if (p.priceType === "range") {
          return `${formatJPY(p.rentalPriceMin)} - ${formatJPY(p.rentalPriceMax)}`;
        }
        return formatJPY(p.rentalPriceMin > 0 ? p.rentalPriceMin : p.rentalPricePerDay);
    };

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
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden ticktoc-shadow">
                        <Image
                            src={plan.images?.[0]?.url || "/placeholder.svg"}
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
                        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
                            {plan.name}
                        </h1>

                        <div className="mt-6 p-4 bg-secondary rounded-xl">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-primary">
                                    {formatPrice(plan)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    / {tPricing("rentalPlan")}
                                </span>
                            </div>
                        </div>

                        {/* Includes (Extracted from description for now) */}
                        <div className="mt-6">
                            <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-accent" />
                                {t("includes")}
                            </h3>
                            <ul className="mt-3 grid gap-2">
                                {includesList.length > 0 && includesList[0] !== "" ? (
                                    includesList.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-foreground">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-muted-foreground italic">Đang cập nhật nội dung...</li>
                                )}
                            </ul>
                        </div>

                        {/* Duration Info */}
                        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                                {tPricing("halfDay")} / {tPricing("fullDay")}
                            </span>
                        </div>

                        {/* CTA */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Button asChild size="lg" className="flex-1">
                                <Link href={`/${locale}/booking?plan=${plan.id}`}>
                                    {t("bookNow")}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
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
                        {relatedPlans.map((rp, idx) => (
                            <FadeIn key={rp.id} delay={idx * 0.05}>
                                <Link
                                    href={`/${locale}/plans/${rp.slug || rp.id}`}
                                    className="group block"
                                >
                                    <div className="bg-card rounded-xl overflow-hidden ticktoc-shadow border border-border hover:border-primary/30 ticktoc-transition">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <Image
                                                src={rp.images?.[0]?.url || "/placeholder.svg"}
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
                        ))}
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
