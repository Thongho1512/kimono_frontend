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
  images: { url: string }[];
  description?: string;
}

interface ProductPlanSectionProps {
  plan: ProductDto;
  pIdx: number;
  locale: string;
  formatPrice: (p: any) => string;
}

export function ProductPlanSection({ plan, pIdx, locale, formatPrice }: ProductPlanSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; 
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <FadeIn key={plan.id} delay={0.2 + pIdx * 0.1}>
      <div className="space-y-6">
        {/* Product Header: Name and Price */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-3">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
            {plan.name}
          </h3>
          <div className="flex items-center gap-2">
             <span className="text-lg sm:text-xl font-bold text-primary">
                {formatPrice(plan)}
             </span>
          </div>
        </div>

        {/* Product Images Slider */}
        <div className="relative group/slider">
          {(plan.images && plan.images.length > 0) ? (
            <>
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar pb-4 -mx-1 px-1"
              >
                {plan.images.map((img, iIdx) => (
                  <Link 
                    key={iIdx} 
                    href={`/${locale}/plans/${plan.slug || plan.id}`}
                    className="flex-none w-[260px] sm:w-[300px] relative aspect-[3/4] rounded-lg overflow-hidden border border-border ticktoc-shadow hover:border-primary/50 transition-all"
                  >
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`${plan.name} - ${iIdx + 1}`}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-105 ticktoc-transition"
                      sizes="300px"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                      <p className="text-white text-xs font-serif">Xem chi tiết</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Slider Buttons */}
              {plan.images.length > 1 && (
                <>
                  <button 
                    onClick={() => scroll('left')}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card/90 shadow-lg border border-border opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground hidden md:block"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => scroll('right')}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card/90 shadow-lg border border-border opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground hidden md:block"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="py-12 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground italic">
              Đang cập nhật hình ảnh mẫu...
            </div>
          )}
        </div>
        
        {plan.description && (
           <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {plan.description}
           </p>
        )}
      </div>
    </FadeIn>
  );
}
