import { setRequestLocale } from "next-intl/server";
import { PricingContent } from "@/components/ticktoc/pricing-content";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090';
  
  const fetchOptions = {
    cache: "no-store" as const
  };

  let categories = [];
  let products = [];

  try {
    const [catsRes, prodsRes] = await Promise.all([
      fetch(`${baseUrl}/api/public/products/categories?culture=${locale}`, fetchOptions),
      fetch(`${baseUrl}/api/public/products?culture=${locale}`, fetchOptions)
    ]);

    if (catsRes.ok) categories = await catsRes.json();
    if (prodsRes.ok) products = await prodsRes.json();
  } catch (error) {
    console.error("Failed to fetch pricing data on server", error);
  }

  return (
    <main className="min-h-screen">
      <PricingContent categories={categories} products={products} />
    </main>
  );
}
