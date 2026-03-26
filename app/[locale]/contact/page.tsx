"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Landmark,
} from "lucide-react";

interface StoreInfo {
  name: string;
  address: string;
  sdt: string;
  email: string;
  openTime: string;
  closeTime: string;
  dayOfWeek: string;
  nearbyPlaces: string;
  urlYoutube: string;
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/api/public/shop-info?culture=${locale}`);
        setStoreInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch store info", err);
      }
    };
    fetchInfo();
  }, [locale]);


  const contactItems = [
    {
      icon: MapPin,
      label: t("address"),
      value: storeInfo?.address || t("addressValue"),
      href: storeInfo?.address ? `https://maps.google.com/?q=${encodeURIComponent(storeInfo.address)}` : "https://maps.google.com/?q=123+Nguyen+Hue+District+1+Ho+Chi+Minh+City",
    },
    {
      icon: Phone,
      label: t("phone"),
      value: storeInfo?.sdt || t("phoneValue"),
      href: `tel:${storeInfo?.sdt || "070-9150-0677"}`,
    },
    {
      icon: Mail,
      label: t("email"),
      value: storeInfo?.email || t("emailValue"),
      href: `mailto:${storeInfo?.email || "kyokimononail.gc@gmail.com"}`,
    },
    {
      icon: Clock,
      label: t("hours"),
      value: storeInfo ? `${storeInfo.openTime} - ${storeInfo.closeTime}, ${storeInfo.dayOfWeek}` : t("hoursValue"),
    },
  ];

  const nearbyPlaces = (storeInfo?.nearbyPlaces || t("nearbyPlaces")).split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb items={[{ label: tNav("contact") }]} />

        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              {t("title")}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-pretty">
              {t("subtitle")}
            </p>
            <div className="sakura-line mt-6 mx-auto w-32" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-16">
          {/* Contact Info */}
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 ticktoc-shadow border border-border">
              <div className="grid gap-6">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-primary ticktoc-transition"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium text-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Nearby Attractions */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Landmark className="h-4 w-4 text-accent" />
                  {t("nearby")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nearbyPlaces.map((place) => (
                    <span
                      key={place}
                      className="inline-block bg-secondary text-secondary-foreground text-sm px-3 py-1.5 rounded-full"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href={`/${locale}/booking`}>
                    {tCommon("bookNow")}
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Shop Photo + Map */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ticktoc-shadow">
                <Image
                  src="/images/shop-interior.jpg"
                  alt={t("shopTour")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-card/90 backdrop-blur-sm text-foreground text-sm px-3 py-1.5 rounded-full font-medium">
                    {t("shopTour")}
                  </span>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ticktoc-shadow border border-border">
                <iframe
                  src="https://maps.google.com/maps?q=京都市東山区祇園町北側347-25&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kyo kimono rental &nail Location"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: schema
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: storeInfo?.name || "Ticktoc Kimono Rental",
            description:
              "Premium kimono rental service in Gion, Kyoto",
            address: {
              "@type": "PostalAddress",
              streetAddress: storeInfo?.address || "347-25 Gionmachi Kitagawa, Higashiyama Ward, 3F, Kyoto 605-0073, Japan",
              addressLocality: "Kyoto",
              addressRegion: "Higashiyama Ward",
              addressCountry: "JP",
            },
            telephone: storeInfo?.sdt || "070-9150-0677",
            email: storeInfo?.email || "kyokimononail.gc@gmail.com",
            openingHours: storeInfo ? `${storeInfo.openTime}-${storeInfo.closeTime}` : "Mo-Su 09:00-19:00",
            url: "https://kyokimonorental.com",
          }),
        }}
      />
    </main>
  );
}
