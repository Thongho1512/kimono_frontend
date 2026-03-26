"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { formatJPY } from "@/lib/data";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2, Baby, User, Sparkles } from "lucide-react";
import api from "@/lib/api";

interface CategoryDto {
  id: string;
  name: string;
}

interface ProductDto {
  id: string;
  categoryId: string;
  name: string;
  rentalPricePerDay: number;
  rentalPriceMin: number;
  rentalPriceMax: number;
  priceType: string;
}

export default function PricingPage() {
  const t = useTranslations("pricing");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get(`/api/public/products/categories?culture=${locale}`),
          api.get(`/api/public/products?culture=${locale}`)
        ]);
        setCategories(catsRes.data);
        setProducts(prodsRes.data);
      } catch (error) {
        console.error("Failed to fetch pricing data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locale]);

  const formatPrice = (p: ProductDto) => {
    const isRange = p.priceType === "range" || p.priceType === "Khoảng";
    if (isRange) {
      return `${formatJPY(p.rentalPriceMin)} - ${formatJPY(p.rentalPriceMax)}`;
    }
    return formatJPY(p.rentalPriceMin > 0 ? p.rentalPriceMin : p.rentalPricePerDay);
  };

  // Grouping logic: use index-based (position from API) to be language-agnostic
  // Backend returns categories ordered: [0]=Women, [1]=Men, [2]=Kids
  const categoriesWithProducts = categories.filter(c => products.some(p => p.categoryId === c.id));
  const womenCat = categoriesWithProducts[0];
  const menCat = categoriesWithProducts[1];
  const kidsCat = categoriesWithProducts[2];

  const renderTable = (category: CategoryDto | undefined, icon: React.ReactNode) => {
    if (!category) return null;
    const catProducts = products.filter(p => p.categoryId === category.id);
    if (catProducts.length === 0) return null;

    return (
      <div className="bg-card rounded-xl ticktoc-shadow border-2 border-foreground/10 overflow-hidden mb-8">
        <div className="bg-foreground/5 border-b-2 border-foreground/10 p-4 flex items-center justify-center gap-3">
           {icon}
           <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground uppercase tracking-widest">
             {category.name}
           </h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-foreground/10">
              <th className="px-6 py-3 font-serif font-semibold text-foreground border-r border-foreground/10">
                {t("kimonoType")}
              </th>
              <th className="px-6 py-3 font-serif font-semibold text-foreground text-center">
                {t("rentalPrice")}
              </th>
            </tr>
          </thead>
          <tbody>
            {catProducts.map((p, i) => (
              <tr key={p.id} className="border-b border-foreground/5 hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4 text-foreground/90 border-r border-foreground/10">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-center font-bold text-primary whitespace-nowrap">
                  {formatPrice(p)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
          <div className="text-center mb-16">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              {t("title")}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-pretty">
              {t("subtitle")}
            </p>
            <div className="sakura-line mt-6 mx-auto w-32" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 pb-12">
           {/* Left Column: Women */}
           <div className="lg:col-span-1">
              <FadeIn delay={0.1}>
                 {renderTable(womenCat, <Sparkles className="h-6 w-6 text-primary" />)}
                 
                 {/* Footnotes */}
                 <div className="mt-8 space-y-4 text-base sm:text-lg text-foreground font-medium px-2">
                    <p className="flex items-start gap-3">
                       <span className="text-primary font-bold text-xl">※</span>
                       <span>{t("footnote1")}</span>
                    </p>
                    <p className="flex items-start gap-3">
                       <span className="text-primary font-bold text-xl">※</span>
                       <span>{t("footnote2")}</span>
                    </p>
                    <p className="flex items-start gap-3 mt-6 text-sm sm:text-base text-muted-foreground font-normal">
                       <span>{t("footnoteNote")}</span>
                    </p>
                 </div>
              </FadeIn>
           </div>

           {/* Right Column: Men & Children */}
           <div className="lg:col-span-1 space-y-8">
              <FadeIn delay={0.2}>
                 {renderTable(menCat, <User className="h-6 w-6 text-primary" />)}
              </FadeIn>
              
              <FadeIn delay={0.3}>
                 {renderTable(kidsCat, <Baby className="h-6 w-6 text-primary" />)}
              </FadeIn>

              {/* Booking CTA */}
              <FadeIn delay={0.4}>
                <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center mt-4">
                   <Button asChild size="lg" className="px-12">
                      <Link href={`/${locale}/booking`}>{tCommon("bookNow")}</Link>
                   </Button>
                </div>
              </FadeIn>
           </div>
        </div>
      </div>
    </main>
  );
}
