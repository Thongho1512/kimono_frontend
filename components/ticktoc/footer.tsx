"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, AtSign } from "lucide-react";
import Image from "next/image";
import { SakuraIcon } from "./sakura-icon";
import api from "@/lib/api";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;

  const [storeInfo, setStoreInfo] = useState<any>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/api/public/shop-info?culture=${locale}`);
        if (res.data) setStoreInfo(res.data);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch store info", err);
        }
        // If 404, we just use the default translations in the component
      }
    };
    fetchInfo();
  }, [locale]);

  const quickLinks = [
    { label: t("nav.home"), href: prefix },
    { label: t("nav.plans"), href: `${prefix}/plans` },
    { label: t("nav.pricing"), href: `${prefix}/pricing` },
    { label: t("nav.booking"), href: `${prefix}/booking` },
    { label: t("nav.gallery"), href: `${prefix}/gallery` },
  ];

  const serviceLinks = [
    { label: t("nav.women"), href: `${prefix}/plans#women` },
    { label: t("nav.men"), href: `${prefix}/plans#men` },
    { label: t("nav.kids"), href: `${prefix}/plans#kids` },
    { label: t("nav.hairstyle"), href: `${prefix}/hairstyle` },
    { label: t("nav.faq"), href: `${prefix}/faq` },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={prefix} className="flex items-center gap-2 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-background/10 group-hover:ring-primary/30 transition-all">
                <Image
                  src="/images/logo.jpg"
                  alt="Kyo Kimono Logo"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-lg font-semibold uppercase">
                {storeInfo?.name || "Kyo Kimono Rental"}
              </span>
            </Link>
            <p className="text-sm leading-relaxed opacity-70">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-4 pt-4">
              {storeInfo?.urlInstagram && (
                <a
                  href={storeInfo.urlInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {storeInfo?.urlFacebook && (
                <a
                  href={storeInfo.urlFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {storeInfo?.urlYoutube && (
                <a
                  href={storeInfo.urlYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="YouTube"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              )}
              {storeInfo?.urlTiktok && (
                <a
                  href={storeInfo.urlTiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.22 8.22 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.12z" />
                  </svg>
                </a>
              )}
              {storeInfo?.urlThreads && (
                <a
                  href={storeInfo.urlThreads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden"
                  aria-label="Threads"
                >
                  <div className="relative h-6 w-6 rounded-full overflow-hidden">
                    <Image
                      src="/images/threads.JPG"
                      alt="Threads"
                      fill
                      className="object-cover"
                    />
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider mb-4">
              {t("footer.services")}
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider mb-4">
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm opacity-70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("347-25 Gionmachi Kitagawa, Higashiyama Ward, 3F, Kyoto 605-0073, Japan")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {storeInfo?.address || t("contact.addressValue")}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm opacity-70">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{storeInfo?.sdt || t("contact.phoneValue")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm opacity-70">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>{storeInfo?.email || t("contact.emailValue")}</span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3 font-bold">{t("footer.nearby")}</p>
              <div className="flex flex-wrap gap-2">
                {(storeInfo !== null ? storeInfo.nearbyPlaces : (t("contact.nearbyPlaces") || "")).split(',').map((place: string, idx: number) => {
                  const cleanedPlace = place.trim();
                  if (!cleanedPlace) return null;
                  return (
                    <a
                      key={idx}
                      href={`https://www.google.com/maps/search/${encodeURIComponent(cleanedPlace + " " + (storeInfo?.address || ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-background/5 border border-background/10 px-2.5 py-1.5 rounded-md hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                    >
                      {cleanedPlace}
                    </a>
                  );
                })}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("347-25 Gionmachi Kitagawa, Higashiyama Ward, 3F, Kyoto 605-0073, Japan")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-[11px] opacity-60 leading-relaxed italic border-l-2 border-primary/20 pl-3 block hover:text-primary transition-colors"
              >
                {storeInfo?.address || t("contact.addressValue")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sakura-line mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-50">
          <div className="flex gap-4">
            <p>&copy; 2026 {t("footer.rights")}</p>
            <Link href={`${prefix}/admin`} className="hover:text-primary transition-colors">Admin</Link>
          </div>
          <p>Kyo Kimono Rental - Kyoto</p>
        </div>
      </div>

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: schema markup
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Kyo Kimono Rental",
            description: "Premium kimono rental service in Gion, Kyoto",
            url: "https://kyokimonorental.com",
            telephone: "070-9150-0677",
            email: "kyokimononail.gc@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "347-25 Gionmachi Kitagawa, Higashiyama Ward, 3F",
              addressLocality: "Kyoto",
              addressRegion: "Kyoto-fu",
              postalCode: "605-0073",
              addressCountry: "JP",
            },
            openingHours: "Mo-Su 09:00-19:00",
            priceRange: "350,000 - 1,200,000 JPY",
          }),
        }}
      />
    </footer>
  );
}
