"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface ContactGalleryProps {
  setSelectedImage: (src: string) => void;
  shopImagesTitle?: string;
  buildingExt?: string;
  shopEnt?: string;
  nearbyGion?: string;
}

export function ContactGallery({ setSelectedImage, shopImagesTitle, buildingExt, shopEnt, nearbyGion }: ContactGalleryProps) {
  const images = [
    { src: "/images/store1.png", label: buildingExt || "Exterior" },
    { src: "/images/store2.jpg", label: shopEnt || "Entrance" },
    { src: "/images/gallery-3.jpg", label: nearbyGion || "Nearby" }
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
        {shopImagesTitle || "Một số hình ảnh về cửa hàng"}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer ticktoc-shadow-sm border border-border/50 group"
            onClick={() => setSelectedImage(img.src)}
          >
            <Image 
              src={img.src} 
              alt={img.label} 
              fill 
              className="object-cover transition-transform duration-300 group-hover:scale-110" 
              sizes="(max-width: 768px) 30vw, 15vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
