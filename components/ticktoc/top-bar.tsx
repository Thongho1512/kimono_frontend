"use client";

import { useState, useEffect } from "react";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin, AtSign } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import api from "@/lib/api";

import Image from "next/image";

export function TopBar() {
    const t = useTranslations();
    const locale = useLocale();
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
            }
        };
        fetchInfo();
    }, [locale]);

    const socialLinks = [
        { id: "instagram", icon: <Instagram className="h-4.5 w-4.5" />, href: storeInfo?.urlInstagram, label: "Instagram" },
        { id: "facebook", icon: <Facebook className="h-4.5 w-4.5" />, href: storeInfo?.urlFacebook, label: "Facebook" },
        { id: "youtube", icon: <Youtube className="h-4.5 w-4.5" />, href: storeInfo?.urlYoutube, label: "YouTube" },
        {
            id: "threads", icon: (
                <div className="h-4.5 w-4.5 relative overflow-hidden rounded-full border border-background/20 group-hover:border-primary/30 transition-all">
                    <Image
                        src="/images/threads.JPG"
                        alt="Threads"
                        fill
                        className="object-cover"
                    />
                </div>
            ), href: storeInfo?.urlThreads, label: "Threads"
        },
    ];

    const tiktokIcon = (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.22 8.22 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.12z" />
        </svg>
    );

    return (
        <div className="w-full bg-foreground text-background py-2 px-4 lg:px-8 border-b border-background/5 relative overflow-hidden group">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs font-medium tracking-wide relative z-10">
                {/* Contact Info */}
                <div className="flex items-center gap-5 sm:gap-8">
                    <a
                        href={`tel:${storeInfo?.sdt || t("contact.phoneValue")}`}
                        className="flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300 group/item"
                    >
                        <div className="p-1 rounded-full bg-background/10 group-hover/item:bg-primary/20 transition-colors">
                            <Phone className="h-3 w-3 text-primary animate-pulse" />
                        </div>
                        <span>{storeInfo?.sdt || t("contact.phoneValue")}</span>
                    </a>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("347-25 Gionmachi Kitagawa, Higashiyama Ward, 3F, Kyoto 605-0073, Japan")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300 group/address"
                    >
                        <div className="p-1 rounded-full bg-background/10 group-hover/address:bg-primary/20 transition-colors">
                            <MapPin className="h-3 w-3 text-primary" />
                        </div>
                        <span className="truncate max-w-[200px] lg:max-w-none">
                            {storeInfo?.address || t("contact.addressValue")}
                        </span>
                    </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                    <span className="opacity-40 hidden xs:inline uppercase text-[9px] tracking-[0.15em]">{t("footer.followUs")}</span>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            social.href && (
                                <a
                                    key={social.id}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-all duration-300 flex items-center justify-center hover:scale-125 transform"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            )
                        ))}
                        {storeInfo?.urlTiktok && (
                            <a
                                href={storeInfo.urlTiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-all duration-300 flex items-center justify-center hover:scale-125 transform"
                                aria-label="TikTok"
                            >
                                {tiktokIcon}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
