"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { formatJPY } from "@/lib/data";

const ProductPlanSection = dynamic(() => import("@/components/ticktoc/product-plan-section").then(m => m.ProductPlanSection), { ssr: false });

interface CategoryDto {
  id: string;
  name: string;
}

interface ProductDto {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  rentalPricePerDay: number;
  rentalPriceMin: number;
  rentalPriceMax: number;
  priceType: string;
  images: { url: string }[];
  description?: string;
}

interface PlansContentProps {
  categories: CategoryDto[];
  products: ProductDto[];
}

export function PlansContent({ categories, products }: PlansContentProps) {
  const t = useTranslations("plans");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState<string>("");

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const offset = 100; // Header offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  // Detect active section on scroll
  useEffect(() => {
    if (categories.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      const categoriesWithProds = categories.filter(cat => products.some(p => p.categoryId === cat.id));

      for (const cat of categoriesWithProds) {
        const element = document.getElementById(`section-${cat.id}`);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, products]);

  // Set initial active section
  useEffect(() => {
    if (categories.length > 0 && products.length > 0 && !activeSection) {
      const firstCat = categories.find(cat => products.some(p => p.categoryId === cat.id));
      if (firstCat) setActiveSection(firstCat.id);
    }
  }, [categories, products, activeSection]);

  const formatPrice = (p: ProductDto) => {
    const isRange = p.priceType === "range" || p.priceType === "Khoảng";
    if (isRange) {
      return `${formatJPY(p.rentalPriceMin)} - ${formatJPY(p.rentalPriceMax)}`;
    }
    return formatJPY(p.rentalPriceMin > 0 ? p.rentalPriceMin : p.rentalPricePerDay);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <PageBreadcrumb items={[{ label: tNav("plans") }]} />

      <FadeIn>
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t("subtitle")}
          </p>
          <div className="sakura-line mt-6 mx-auto w-32" />
        </div>
      </FadeIn>

      <div className="space-y-20 pb-20">
        {categories.map((cat) => {
          const catProducts = products
            .filter(p => p.categoryId === cat.id)
            .sort((a, b) => {
              const priceA = a.rentalPriceMin > 0 ? a.rentalPriceMin : a.rentalPricePerDay;
              const priceB = b.rentalPriceMin > 0 ? b.rentalPriceMin : b.rentalPricePerDay;
              return priceB - priceA;
            });
          if (catProducts.length === 0) return null;

          return (
            <section
              key={cat.id}
              id={`section-${cat.id}`}
              className="scroll-mt-24"
            >
              <FadeIn delay={0.1}>
                <div className="flex flex-col items-center mb-12">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-center">
                    {cat.name}
                  </h2>
                  <div className="sakura-line mt-4 w-24 mx-auto" />
                </div>
              </FadeIn>

              <div className="space-y-16">
                {catProducts.map((plan, pIdx) => (
                  <ProductPlanSection 
                    key={plan.id} 
                    plan={plan} 
                    pIdx={pIdx} 
                    locale={locale} 
                    formatPrice={formatPrice} 
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-auto max-w-[95vw] no-scrollbar">
        <div className="bg-card/95 backdrop-blur-md rounded-full shadow-2xl border border-border px-2 py-2 flex items-center gap-2">
          {categories
            .filter(cat => products.some(p => p.categoryId === cat.id))
            .map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium ticktoc-transition flex items-center gap-2 whitespace-nowrap",
                  activeSection === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <span>{cat.name}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
