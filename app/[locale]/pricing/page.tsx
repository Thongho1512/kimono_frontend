"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { extrasData, formatJPY } from "@/lib/data";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Metadata } from "next";
import { getSeoContent } from "@/lib/seo-registry";

interface ProductDto {
  id: string;
  name: string;
  rentalPricePerDay: number;
}

export default function PricingPage() {
  const t = useTranslations("pricing");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/api/public/products?culture=${locale}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products for pricing", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb items={[{ label: tNav("pricing") }]} />

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

        {/* Pricing Table */}
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-2xl ticktoc-shadow border border-border overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary">
                    <th className="px-6 py-4 font-serif font-semibold text-foreground">
                      {t("package")}
                    </th>
                    <th className="px-6 py-4 font-serif font-semibold text-foreground text-center">
                      {t("fullDay")} {/* Using "Full Day" label for Rental Price Per Day */}
                    </th>
                    <th className="px-6 py-4 font-serif font-semibold text-foreground text-center hidden sm:table-cell">
                      &nbsp;
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr
                      key={product.id}
                      className={`border-t border-border ${i % 2 === 1 ? "bg-secondary/40" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">
                          {product.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-primary font-semibold">
                        {formatJPY(product.rentalPricePerDay)}
                      </td>
                      <td className="px-6 py-4 text-center hidden sm:table-cell">
                        <Button asChild size="sm" variant="outline" className="bg-transparent">
                          <Link href={`/${locale}/booking?plan=${product.id}`}>
                            {tCommon("bookNow")}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                        Chưa có thông tin bảng giá.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Extras - Static for now as per plan */}
        <FadeIn delay={0.2}>
          <div className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
              {t("extras")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {extrasData.map((extra) => (
                <div
                  key={extra.key}
                  className="bg-card rounded-xl p-5 ticktoc-shadow border border-border text-center"
                >
                  <p className="font-medium text-foreground">
                    {t(extra.key)}
                  </p>
                  <p className="mt-2 text-xl font-bold text-primary">
                    {formatJPY(extra.price)}
                  </p>
                </div>
              ))}
            </div>

            {/* Static Info from Image */}
            <div className="mt-8 p-6 bg-secondary/30 rounded-xl border border-border max-w-2xl mx-auto">
              <ul className="space-y-3 text-foreground/80">
                <li className="flex gap-2">
                  <span className="text-primary">※</span>
                  <span>{t("photoPackageInclude")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">※</span>
                  <span>{t("extraPhotoEdit")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">※</span>
                  <span>{t("photoIssues")}</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="text-center pb-16">
            <Button asChild size="lg">
              <Link href={`/${locale}/booking`}>{tCommon("bookNow")}</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
