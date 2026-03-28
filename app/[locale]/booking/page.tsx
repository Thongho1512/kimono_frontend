import { setRequestLocale } from "next-intl/server";
import BookingFormRoot from "./booking-form";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090';

  let products = [];
  try {
    const res = await fetch(`${baseUrl}/api/public/products?culture=${locale}`, {
      cache: "no-store"
    });
    if (res.ok) products = await res.json();
  } catch (error) {
    console.error("Failed to fetch products on server", error);
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookingFormRoot initialProducts={products} />
      </div>
    </main>
  );
}
