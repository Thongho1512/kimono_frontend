import { setRequestLocale } from "next-intl/server";
import { HairstyleContent } from "@/components/ticktoc/hairstyle-content";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HairstylePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090';

  let styles = [];
  try {
    const res = await fetch(`${baseUrl}/api/public/hair-styles?culture=${locale}`, {
      cache: "no-store"
    });
    if (res.ok) styles = await res.json();
  } catch (error) {
    console.error("Failed to fetch hairstyles on server", error);
  }

  return (
    <main className="min-h-screen">
      <HairstyleContent initialStyles={styles} />
    </main>
  );
}
