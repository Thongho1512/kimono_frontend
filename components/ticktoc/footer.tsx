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
                  className="p-2.5 rounded-full bg-background/5 hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Threads"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M14.103 20.143c-2.629 0-4.547-1.021-4.757-3.751h-.01c-.524.794-1.136 1.391-1.834 1.789-.7.4-1.623.601-2.458.601-1.491 0-2.584-.542-3.28-1.627-.696-1.085-.81-2.74-.12-4.57l.147-.38c.52-1.395 1.582-2.417 3.145-3.027 1.562-.611 3.914-.811 5.48-.811h1.547v-1.1c0-.627-.24-1.168-.718-1.62-.478-.451-1.112-.676-1.904-.676-1.277 0-2.505.341-3.684 1.023l-.149.086c-.218.125-.494.048-.619-.17l-.547-.951c-.13-.226-.05-.515.178-.646l.163-.094c1.613-.934 3.327-1.4 5.14-1.4 1.258 0 2.294.341 3.106 1.023.811.681 1.255 1.63 1.255 2.846v4.618c0 .519.103.953.308 1.303.206.35.539.613.911.787l.149.07c.22.104.307.368.196.577l-.46.868c-.114.215-.373.298-.588.188l-.209-.107c-.456-.234-.844-.555-1.166-1.011-.192.341-.433.633-.722.875-.29.241-.652.434-1.088.58a3.177 3.177 0 0 1-1.253.25zm-4.767-4.48c.162 1.397.896 2.095 2.2 2.095.632 0 1.103-.16 1.412-.48.31-.32.465-.742.465-1.265v-.31h-1.455c-1.556 0-2.235.334-2.622 1.011v.204zm-1.026-3.992c1.393.108 2.375.435 2.943.981.411.396.618.88.618 1.453v.01c0 .022.012.033.036.033h1.597c2.091 0 3.136-.906 3.136-2.719V8.815c0-2.107-1.69-3.161-5.068-3.161H9.992c-2.091 0-3.136.905-3.136 2.716v2.607zm-2.228 1.246c.556 1.47 1.196 2.204 1.918 2.204.42 0 .694-.131.815-.392s.117-.615-.012-1.059l-.027-.087c-.675-2.275-1.062-3.412-1.161-3.412-.132 0-.273.085-.425.253s-.304.408-.456.719l-.652 1.774z" />
                  </svg>
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
