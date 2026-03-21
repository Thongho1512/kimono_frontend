import { Hero } from "@/components/ticktoc/hero";
import { FeaturedPlans } from "@/components/ticktoc/featured-plans";
import { WhyUs } from "@/components/ticktoc/why-us";
import { Testimonials } from "@/components/ticktoc/testimonials";
import { CTABanner } from "@/components/ticktoc/cta-banner";
import { AboutSection } from "@/components/ticktoc/about-section";
import { ProcessSection } from "@/components/ticktoc/process-section";
import { VideosSection } from "@/components/ticktoc/videos-section";
import { Metadata } from "next";
import { getSeoContent } from "@/lib/seo-registry";

export const runtime = "edge";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Manual override for home page SEO if defined in registry
  const seo = getSeoContent("home", locale, {
    title: "Ticktoc Kimono | Kimono Rental & Photography in Ho Chi Minh City",
    description: "Discover the beauty of traditional Japanese culture with our premium kimono rental and professional photography services."
  });

  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
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
