"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const prefix = `/${locale}`;

  const allItems = [{ label: t("home"), href: prefix }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        {allItems.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {i === 0 && <Home className="h-3.5 w-3.5 mr-0.5" />}
            {item.href && i < allItems.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-primary ticktoc-transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>

      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: schema
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: allItems.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.label,
              item: item.href
                ? `https://ticktockimono.vn${item.href}`
                : undefined,
            })),
          }),
        }}
      />
    </nav>
  );
}
