import { notFound } from "next/navigation";
import PlanDetailContent from "./plan-detail-content";
import { Metadata } from "next";
import { getSeoContent } from "@/lib/seo-registry";



interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

async function getPlan(slug: string, locale: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5090";
  try {
    const res = await fetch(`${apiUrl}/api/public/products/${slug}?culture=${locale}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch plan in Server Component", error);
    return null;
  }
}

async function getRelatedPlans(locale: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5090";
  try {
    const res = await fetch(`${apiUrl}/api/public/products?culture=${locale}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const plan = await getPlan(slug, locale);
  if (!plan) return { title: "Plan Not Found - Ticktoc Kimono" };

  const seo = getSeoContent(slug, locale, {
    title: `${plan.name} | Ticktoc Kimono Rental`,
    description: plan.description || `Rent authentic ${plan.name} in Ho Chi Minh City.`
  });

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: plan.images?.length > 0 ? [plan.images[0].url] : [],
    }
  };
}

export default async function PlanDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const plan = await getPlan(slug, locale);
  if (!plan) return notFound();

  const related = await getRelatedPlans(locale);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PlanDetailContent
          plan={plan}
          locale={locale}
          relatedPlans={related.filter((p: any) => p.id !== plan.id)}
        />
      </div>
    </main>
  );
}
