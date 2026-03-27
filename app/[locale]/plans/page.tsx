import { setRequestLocale } from "next-intl/server";
import { PlansContent } from "@/components/ticktoc/plans-content";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PlansPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090';

  let categories = [];
  let products = [];

  try {
    const [catsRes, prodsRes] = await Promise.all([
      fetch(`${baseUrl}/api/public/products/categories?culture=${locale}`, {
        next: { revalidate: 3600 }
      }),
      fetch(`${baseUrl}/api/public/products?culture=${locale}`, {
        next: { revalidate: 3600 }
      })
    ]);

    if (catsRes.ok) categories = await catsRes.json();
    if (prodsRes.ok) products = await prodsRes.json();
  } catch (error) {
    console.error("Failed to fetch plans data on server", error);
  }

  return (
    <main className="min-h-screen">
      <PlansContent categories={categories} products={products} />
    </main>
  );
}
