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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {catProducts.map((plan, pIdx) => (
                    <FadeIn key={plan.id} delay={0.1 + pIdx * 0.05}>
                      <Link
                        href={`/${locale}/plans/${plan.slug || plan.id}`}
                        className="group block h-full"
                      >
                        <div className="bg-card rounded-xl overflow-hidden ticktoc-shadow border border-border hover:border-primary/30 ticktoc-transition h-full flex flex-col">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                              src={plan.images?.[0]?.url || "/placeholder.svg"}
                              alt={plan.name}
                              fill
                              className="object-cover group-hover:scale-105 ticktoc-transition"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary ticktoc-transition">
                              {plan.name}
                            </h3>
                            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                              {plan.description || "..."}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-primary font-bold text-lg">
                                {formatJPY(plan.rentalPricePerDay)}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 ticktoc-transition" />
                            </div>
                          </div>
                        </div>
                      </Link>
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
