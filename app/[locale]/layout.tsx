import React from "react";
import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/ticktoc/header";
import { Footer } from "@/components/ticktoc/footer";
import { CherryBlossoms } from "@/components/ticktoc/cherry-blossoms";
import { ScrollToTop } from "@/components/ticktoc/scroll-to-top";
import { SocialFloat } from "@/components/ticktoc/social-float";
import { AuthProvider } from "@/lib/auth-context";
import LayoutWrapper from "./layout-wrapper";
import { Toaster } from "sonner";
import "../globals.css";

export const runtime = "edge";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  weight: ["400", "500", "600", "700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "kimono rental",
      "thuê kimono",
      "kimono Sài Gòn",
      "kimono Ho Chi Minh",
      "着物レンタル",
      "Ticktoc",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  const hrefLangs = routing.locales.map((loc) => ({
    rel: "alternate" as const,
    hrefLang: loc,
    href: `/${loc}`,
  }));

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {hrefLangs.map((link) => (
          <link
            key={link.hrefLang}
            rel="alternate"
            hrefLang={link.hrefLang}
            href={link.href}
          />
        ))}
      </head>
      <body
        className={`${inter.variable} ${notoSerifJP.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
