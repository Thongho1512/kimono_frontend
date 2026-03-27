import dynamic from "next/dynamic";
import { Hero } from "@/components/ticktoc/hero";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Lazy-load all below-the-fold sections to reduce initial JS bundle
const AboutSection   = dynamic(() => import("@/components/ticktoc/about-section").then(m => ({ default: m.AboutSection })));
const FeaturedPlans  = dynamic(() => import("@/components/ticktoc/featured-plans").then(m => ({ default: m.FeaturedPlans })));
const ProcessSection = dynamic(() => import("@/components/ticktoc/process-section").then(m => ({ default: m.ProcessSection })));
const WhyUs          = dynamic(() => import("@/components/ticktoc/why-us").then(m => ({ default: m.WhyUs })));
const Testimonials   = dynamic(() => import("@/components/ticktoc/testimonials").then(m => ({ default: m.Testimonials })));
const CTABanner      = dynamic(() => import("@/components/ticktoc/cta-banner").then(m => ({ default: m.CTABanner })));

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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090';
  let initialPlans = [];
  try {
    const res = await fetch(`${baseUrl}/api/public/products?culture=${locale}`, {
      next: { revalidate: 1800 }
    });
    if (res.ok) {
      const allProducts = await res.json();
      initialPlans = allProducts.slice(0, 4);
    }
  } catch (error) {
    console.error("Failed to fetch plans for home page", error);
  }

  return (
    <main>
      {/* Hero loads immediately (above the fold) */}
      <Hero />
      {/* Everything below lazy-loads as the user scrolls */}
      <AboutSection />
      <FeaturedPlans initialPlans={initialPlans} />
      <ProcessSection />
      <WhyUs />
      <Testimonials />
      <CTABanner />
    </main>
  );
}
