"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { formatJPY } from "@/lib/data";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

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

export default function PlansPage() {
  const t = useTranslations("plans");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState<string>("");

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
        console.error("Failed to fetch plans data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatPrice = (p: ProductDto) => {
    if (p.priceType === "range") {
      return `${formatJPY(p.rentalPriceMin)} - ${formatJPY(p.rentalPriceMax)}`;
    }
    return formatJPY(p.rentalPriceMin > 0 ? p.rentalPriceMin : p.rentalPricePerDay);
  };


  return (
    <main className="min-h-screen">
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

        {/* Dynamic Categories Sections */}
        <div className="space-y-20 pb-20">
          {categories.map((cat, idx) => {
            const catProducts = products.filter(p => p.categoryId === cat.id);
            if (catProducts.length === 0) return null;

            return (
              <section
                key={cat.id}
                id={`section-${cat.id}`}
                className="scroll-mt-24"
              >
                <FadeIn delay={0.1}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground text-center px-4">
                      {cat.name}
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </FadeIn>

                {/* Price Table for the Category */}
                <FadeIn delay={0.2}>
                  <div className="mb-12 overflow-hidden rounded-xl border border-border ticktoc-shadow bg-card">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/50">
                          <th className="px-6 py-4 font-serif text-lg font-bold border-b border-border">Các loại kimono</th>
                          <th className="px-6 py-4 font-serif text-lg font-bold border-b border-border text-right">Giá cho thuê</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catProducts.map((plan) => (
                          <tr key={plan.id} className="hover:bg-secondary/30 ticktoc-transition group">
                            <td className="px-6 py-4 border-b border-border font-medium group-hover:text-primary">
                              {plan.name}
                            </td>
                            <td className="px-6 py-4 border-b border-border text-right font-bold text-primary">
                              {formatPrice(plan)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-4 bg-secondary/10 italic text-[13px] text-muted-foreground space-y-1">
                       <p>※ Giá đã bao gồm: làm tóc, túi, dép</p>
                       <p>※ Make-up cơ bản: +3500JPY</p>
                    </div>
                  </div>
                </FadeIn>

                {/* Visual Samples Section Header (Optional) */}
                <FadeIn delay={0.3}>
                  <div className="mb-6 flex items-center gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Hình ảnh mẫu</h3>
                    <div className="h-px w-full bg-border" />
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catProducts.map((plan, pIdx) => (
                    <FadeIn key={plan.id} delay={0.1 + pIdx * 0.05}>
                      <div className="space-y-4">
                        <Link
                          href={`/${locale}/plans/${plan.slug || plan.id}`}
                          className="group block"
                        >
                          <div className="bg-card rounded-xl overflow-hidden ticktoc-shadow border border-border hover:border-primary/30 ticktoc-transition aspect-[3/4] relative">
                            <Image
                              src={plan.images?.[0]?.url || "/placeholder.svg"}
                              alt={plan.name}
                              fill
                              className="object-cover group-hover:scale-105 ticktoc-transition"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <p className="text-white font-serif text-lg font-bold">{plan.name}</p>
                               <p className="text-primary-foreground/90 font-bold">{formatPrice(plan)}</p>
                            </div>
                          </div>
                        </Link>
                        <div className="text-center">
                          <h4 className="font-serif text-lg font-semibold">{plan.name}</h4>
                          <p className="text-primary font-bold text-sm">{formatPrice(plan)}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Floating Navigation Bar - Dynamic based on categories that have products */}
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
    </main>
  );
}
