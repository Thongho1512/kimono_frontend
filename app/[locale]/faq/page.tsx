"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  { q: "q1", a: "a1" },
  { q: "q2", a: "a2" },
  { q: "q3", a: "a3" },
  { q: "q4", a: "a4" },
  { q: "q5", a: "a5" },
  { q: "q6", a: "a6" },
  { q: "q7", a: "a7" },
  { q: "q8", a: "a8" },
];

export default function FAQPage() {
  const t = useTranslations("faq");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb items={[{ label: tNav("faq") }]} />

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

        <FadeIn delay={0.1}>
          <div className="bg-card rounded-2xl p-6 sm:p-8 ticktoc-shadow border border-border mb-12">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, i) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left font-serif text-foreground hover:text-primary hover:no-underline py-5">
                    {t(item.q)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {t(item.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeIn>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: schema
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: t(item.q),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t(item.a),
                },
              })),
            }),
          }}
        />

        <FadeIn delay={0.2}>
          <div className="text-center pb-16">
            <p className="text-muted-foreground mb-4">
              {t("subtitle")}
            </p>
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>{tNav("contact")}</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
