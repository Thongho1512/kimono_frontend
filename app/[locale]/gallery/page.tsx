import { setRequestLocale } from "next-intl/server";
import { GalleryContent } from "@/components/ticktoc/gallery-content";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090';

  let images = [];
  try {
    const res = await fetch(`${baseUrl}/api/public/albums`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) images = await res.json();
  } catch (error) {
    console.error("Failed to fetch gallery images on server", error);
  }

  return (
    <main className="min-h-screen">
      <GalleryContent initialImages={images} />
    </main>
  );
}
