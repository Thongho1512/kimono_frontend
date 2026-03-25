import { Hero } from "@/components/ticktoc/hero";
import { FeaturedPlans } from "@/components/ticktoc/featured-plans";
import { WhyUs } from "@/components/ticktoc/why-us";
import { Testimonials } from "@/components/ticktoc/testimonials";
import { CTABanner } from "@/components/ticktoc/cta-banner";
import { AboutSection } from "@/components/ticktoc/about-section";
import { ProcessSection } from "@/components/ticktoc/process-section";
import { VideosSection } from "@/components/ticktoc/videos-section";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (

    <main>
      <Hero />
      <AboutSection />
      <FeaturedPlans />
      <VideosSection />
      <ProcessSection />
      <WhyUs />
      <Testimonials />
      <CTABanner />
    </main>
  );
}
