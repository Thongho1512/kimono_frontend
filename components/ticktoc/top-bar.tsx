"use client";

import { useState, useEffect } from "react";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin, AtSign } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import api from "@/lib/api";

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
        { id: "threads", icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M14.103 20.143c-2.629 0-4.547-1.021-4.757-3.751h-.01c-.524.794-1.136 1.391-1.834 1.789-.7.4-1.623.601-2.458.601-1.491 0-2.584-.542-3.28-1.627-.696-1.085-.81-2.74-.12-4.57l.147-.38c.52-1.395 1.582-2.417 3.145-3.027 1.562-.611 3.914-.811 5.48-.811h1.547v-1.1c0-.627-.24-1.168-.718-1.62-.478-.451-1.112-.676-1.904-.676-1.277 0-2.505.341-3.684 1.023l-.149.086c-.218.125-.494.048-.619-.17l-.547-.951c-.13-.226-.05-.515.178-.646l.163-.094c1.613-.934 3.327-1.4 5.14-1.4 1.258 0 2.294.341 3.106 1.023.811.681 1.255 1.63 1.255 2.846v4.618c0 .519.103.953.308 1.303.206.35.539.613.911.787l.149.07c.22.104.307.368.196.577l-.46.868c-.114.215-.373.298-.588.188l-.209-.107c-.456-.234-.844-.555-1.166-1.011-.192.341-.433.633-.722.875-.29.241-.652.434-1.088.58a3.177 3.177 0 0 1-1.253.25zm-4.767-4.48c.162 1.397.896 2.095 2.2 2.095.632 0 1.103-.16 1.412-.48.31-.32.465-.742.465-1.265v-.31h-1.455c-1.556 0-2.235.334-2.622 1.011v.204zm-1.026-3.992c1.393.108 2.375.435 2.943.981.411.396.618.88.618 1.453v.01c0 .022.012.033.036.033h1.597c2.091 0 3.136-.906 3.136-2.719V8.815c0-2.107-1.69-3.161-5.068-3.161H9.992c-2.091 0-3.136.905-3.136 2.716v2.607zm-2.228 1.246c.556 1.47 1.196 2.204 1.918 2.204.42 0 .694-.131.815-.392s.117-.615-.012-1.059l-.027-.087c-.675-2.275-1.062-3.412-1.161-3.412-.132 0-.273.085-.425.253s-.304.408-.456.719l-.652 1.774z" />
            </svg>
        ), href: storeInfo?.urlThreads, label: "Threads" },
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
                    <div className="hidden md:flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-300">
                        <div className="p-1 rounded-full bg-background/10">
                            <MapPin className="h-3 w-3 text-primary" />
                        </div>
                        <span className="truncate max-w-[200px] lg:max-w-none">
                            {storeInfo?.address || t("contact.addressValue")}
                        </span>
                    </div>
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
