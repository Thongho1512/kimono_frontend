"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/ticktoc/fade-in";

interface ProductDto {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  rentalPricePerDay: number;
  rentalPriceMin: number;
  rentalPriceMax: number;
  priceType: string;
  imageUrl?: string;
  ImageUrl?: string;
  description?: string;
}

interface ProductPlanSectionProps {
  plan: ProductDto;
  pIdx: number;
  locale: string;
  formatPrice: (p: any) => string;
}

export function ProductPlanSection({ plan, pIdx, locale, formatPrice }: ProductPlanSectionProps) {
  const currentImageUrl = plan.imageUrl || plan.ImageUrl;

  return (
    <FadeIn key={plan.id} delay={0.1 + (pIdx % 5) * 0.1}>
      <Link 
        href={`/${locale}/plans/${plan.slug || plan.id}`}
        className="group/card flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {currentImageUrl ? (
            <>
              <Image
                src={currentImageUrl}
                alt={plan.name}
                fill
                priority={pIdx < 5}
                className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
                 <span className="bg-white/90 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full font-bold text-xs shadow-lg transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                   {formatPrice(plan)}
                 </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-neutral-50 flex flex-col items-center justify-center text-muted-foreground gap-2 border-b border-dashed border-neutral-100">
              <ChevronRight className="h-6 w-6 opacity-20" />
              <p className="text-[10px] italic font-medium px-4 text-center">Đang cập nhật hình ảnh mẫu cho {plan.name}...</p>
            </div>
          )}
          
          {/* Top-right Tag for Price */}
          <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm group-hover/card:bg-primary transition-colors">
            {formatPrice(plan)}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover/card:text-primary transition-colors line-clamp-2 mb-1">
            {plan.name}
          </h3>
          
          {plan.description && (
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mt-auto">
              {plan.description}
            </p>
          )}
        </div>
      </Link>
    </FadeIn>
  );
}
