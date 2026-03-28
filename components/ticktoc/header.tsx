"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { SakuraIcon } from "./sakura-icon";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const t = useTranslations("nav");
  const locale = useLocale();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/api/public/shop-info?culture=${locale}`);
        if (res.data) setStoreInfo(res.data);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch store info in header", err);
        }
      }
    };
    fetchInfo();
  }, [locale]);

  const prefix = `/${locale}`;

  const navItems = [
    { label: t("home"), href: prefix },
    { label: t("pricing"), href: `${prefix}/pricing` },
    { label: t("booking"), href: `${prefix}/booking` },
    { label: t("manageBooking"), href: `${prefix}/booking/lookup` },
    { label: t("hairstyle"), href: `${prefix}/hairstyle` },
    { label: t("faq"), href: `${prefix}/faq` },
    { label: t("gallery"), href: `${prefix}/gallery` },
    { label: t("contact"), href: `${prefix}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href={prefix} className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
            <Image
              src="/images/logo.jpg"
              alt="Kyo Kimono Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground uppercase hidden xs:block">
            {storeInfo?.name || "Kyo Kimono Rental"}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href={prefix}
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary ticktoc-transition rounded-md hover:bg-secondary"
          >
            {t("home")}
          </Link>

          {/* Plans Button */}
          <Link
            href={`${prefix}/plans`}
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary ticktoc-transition rounded-md hover:bg-secondary"
          >
            {t("plans")}
          </Link>

          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary ticktoc-transition rounded-md hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href={`${prefix}/booking`} className="hidden sm:block">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t("booking")}
            </Button>
          </Link>
          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex flex-col px-4 py-4 gap-1">
            <Link
              href={prefix}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md"
            >
              {t("home")}
            </Link>
            <Link
              href={`${prefix}/plans`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md"
            >
              {t("plans")}
            </Link>
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md"
              >
                {item.label}
              </Link>
            ))}

            <Link href={`${prefix}/booking`} onClick={() => setMobileOpen(false)} className="mt-3">
              <Button className="w-full bg-primary text-primary-foreground">
                {t("booking")}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
