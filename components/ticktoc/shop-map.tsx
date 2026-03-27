"use client";

import { useTranslations } from "next-intl";

interface ShopMapProps {
  title?: string;
}

export function ShopMap({ title }: ShopMapProps) {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ticktoc-shadow border border-border">
      <iframe
        src="https://maps.google.com/maps?q=347-25%20Gionmachi%20Kitagawa,%20Higashiyama%20Ward,%203F,%20Kyoto%20605-0073,%20Japan&t=&z=18&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title || "Kyo kimono rental &nail Location"}
        className="absolute inset-0"
      />
    </div>
  );
}
