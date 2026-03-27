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
  X,
  Facebook,
  Instagram,
  Youtube,
  AtSign,
  AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

const ShopMap = dynamic(() => import("@/components/ticktoc/shop-map").then(m => m.ShopMap), { ssr: false });
const ContactGallery = dynamic(() => import("@/components/ticktoc/contact-gallery").then(m => m.ContactGallery), { ssr: false });
const Lightbox = dynamic(() => import("@/components/ticktoc/lightbox").then(m => m.Lightbox), { ssr: false });

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
  urlFacebook?: string;
  urlInstagram?: string;
  urlTiktok?: string;
  urlThreads?: string;
  urlZalo?: string;
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tBooking = useTranslations("booking");
  const locale = useLocale();

  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("347-25 Gionmachi Kitagawa, Higashiyama Ward, 3F, Kyoto 605-0073, Japan")}`,
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

  const nearbyPlaces = (storeInfo !== null ? storeInfo.nearbyPlaces : t("nearbyPlaces")).split(",").map((s) => s.trim()).filter(Boolean);

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

              <div className="mt-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm whitespace-pre-wrap">{tBooking("policyTitle")}</h4>
                  <p className="text-amber-800 dark:text-amber-300/80 text-xs leading-relaxed">
                    {tBooking("policyText")}
                  </p>
                </div>
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

              {/* Social Media Link section */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  {t("connectWithUs") || "Kết nối với chúng tôi"}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {storeInfo?.urlFacebook && (
                    <a href={storeInfo.urlFacebook} target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 transform hover:scale-110 shadow-sm"
                       aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {storeInfo?.urlInstagram && (
                    <a href={storeInfo.urlInstagram} target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-110 shadow-sm"
                       aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {storeInfo?.urlTiktok && (
                    <a href={storeInfo.urlTiktok} target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-black hover:text-white hover:border-black transition-all duration-300 transform hover:scale-110 shadow-sm"
                       aria-label="TikTok">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.22 8.22 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.12z" />
                      </svg>
                    </a>
                  )}
                  {storeInfo?.urlYoutube && (
                    <a href={storeInfo.urlYoutube} target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all duration-300 transform hover:scale-110 shadow-sm"
                       aria-label="YouTube">
                      <Youtube className="h-5 w-5" />
                    </a>
                  )}
                  {storeInfo?.urlThreads && (
                    <a href={storeInfo.urlThreads} target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-black hover:text-white hover:border-black transition-all duration-300 transform hover:scale-110 shadow-sm"
                       aria-label="Threads">
                      <AtSign className="h-5 w-5" />
                    </a>
                  )}
                </div>
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
                  priority
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
              <ShopMap title={t("name") || "Kyo kimono rental & nail Location"} />

              {/* Tiny Thumbnails Gallery right below map */}
              <ContactGallery 
                setSelectedImage={setSelectedImage}
                shopImagesTitle={t("shopImagesTitle")}
                buildingExt={t("buildingExt")}
                shopEnt={t("shopEnt")}
                nearbyGion={t("nearbyGion")}
              />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Basic Lightbox Modal */}
      {selectedImage && (
        <Lightbox 
          images={[selectedImage]} 
          currentIndex={0} 
          onClose={() => setSelectedImage(null)} 
        />
      )}

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
