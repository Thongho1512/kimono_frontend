"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MessageCircle, CheckCircle2, Phone, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import api from "@/lib/api";
import { formatJPY } from "@/lib/data";

import { toast } from "sonner"; // Assuming sonner is available or use standard alert

interface ProductDto {
  id: string;
  name: string;
  rentalPricePerDay: number;
  rentalPriceMin: number;
  rentalPriceMax: number;
  priceType: string;
  images: { url: string }[];
}

interface CartItem {
  productId: string;
  productName: string;
  priceMin: number;
  priceMax: number;
  priceType: string;
  quantity: number;
  image: string;
}

function BookingForm() {
  const t = useTranslations("booking");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const preselectedPlanId = searchParams.get("plan");

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "09:00",
    people: "1",
    note: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/public/products');
        setProducts(res.data);

        // Handle preselected plan
        if (preselectedPlanId && res.data) {
          const product = res.data.find((p: ProductDto) => p.id === preselectedPlanId);
          if (product) {
            addToCart(product);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Run once

  // Helper to add to cart (using local state logic to avoid dependency loop in useEffect)
  const addToCart = (product: ProductDto) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      
      const isRange = product.priceType === "range" || product.priceType === "Khoảng";
      
      return [...prev, {
        productId: product.id,
        productName: product.name,
        priceMin: isRange ? product.rentalPriceMin : (product.rentalPriceMin > 0 ? product.rentalPriceMin : product.rentalPricePerDay),
        priceMax: isRange ? product.rentalPriceMax : (product.rentalPriceMin > 0 ? product.rentalPriceMin : product.rentalPricePerDay),
        priceType: product.priceType,
        quantity: 1,
        image: product.images?.[0]?.url || ""
      }];
    });
    toast.success(tCommon("addedToCart") || "Added to cart");
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalMin = cart.reduce((sum, item) => sum + (item.priceMin * item.quantity), 0);
  const totalMax = cart.reduce((sum, item) => sum + (item.priceMax * item.quantity), 0);
  
  const formatRange = (min: number, max: number, type: string) => {
    const isRange = type === "range" || type === "Khoảng";
    if (isRange) return `${formatJPY(min)}-${formatJPY(max)}`;
    return formatJPY(min);
  };

  const validateForm = () => {
    if (cart.length === 0) {
      toast.error("Vui lòng chọn ít nhất một dịch vụ.");
      return false;
    }
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ và tên.");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email.");
      return false;
    }
    if (!formData.date) {
      toast.error("Vui lòng chọn ngày thuê.");
      return false;
    }
    if (!formData.time) {
      toast.error("Vui lòng chọn giờ đến dự kiến.");
      return false;
    }
    if (!formData.people || parseInt(formData.people) < 1) {
      toast.error("Vui lòng nhập số người (tối thiểu 1).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);

    const payload = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      bookingDate: formData.date,
      arrivalTime: formData.time,
      numberOfPeople: parseInt(formData.people),
      note: formData.note,
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        price: item.priceMin,
        priceMin: item.priceMin,
        priceMax: item.priceMax,
        quantity: item.quantity
      }))
    };

    try {
      const res = await api.post('/api/public/bookings/send-email', payload);
      if (res.status === 200 || res.status === 201) {
        setSubmitted(true);
        setCart([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error("Booking failed", error);

      // If it's a 500 but we suspect the request might have been received (or the error is just notification)
      // we can choose how to handle it. For now, let's show the detailed error if available.
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to send booking request. Please try again or contact us via Zalo.";
      toast.error(errorMsg);

      // Even if email fails, if the user really wants the 'Thank you' page, 
      // they might prefer it over a stuck form. But usually it's better to keep them on the form.
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <FadeIn>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              {t("success")}
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your request! We will contact you shortly to confirm your booking.
            </p>
            <Button asChild className="mt-2">
              <Link href={`/${locale}`}>{tNav("home")}</Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <>
      <PageBreadcrumb items={[{ label: tNav("booking") }]} />

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
        {/* Product Selection List */}
        <div className="lg:col-span-7 space-y-6">
          <FadeIn delay={0.1}>
            <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Select Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-card border border-border rounded-lg p-4 flex gap-4 hover:border-primary/50 transition-colors">
                  <div className="relative w-20 h-24 shrink-0 rounded-md overflow-hidden bg-secondary">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium line-clamp-1" title={product.name}>{product.name}</h3>
                      <p className="text-primary font-bold text-sm">
                        {formatRange(
                          product.rentalPriceMin > 0 ? product.rentalPriceMin : product.rentalPricePerDay, 
                          product.rentalPriceMax, 
                          product.priceType
                        )}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => addToCart(product)} className="w-full mt-2 h-8">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Order Form & Cart Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            {/* Cart Summary */}
            <FadeIn delay={0.2}>
              <div className="bg-card rounded-2xl p-6 ticktoc-shadow border border-border">
                <h3 className="font-serif text-lg font-bold mb-4">Your Selection</h3>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-secondary/30 rounded-lg border border-dashed border-border">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No items selected yet.</p>
                    <p className="text-xs">Select services from the list.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.productId} className="flex gap-3 items-center">
                        <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 bg-secondary">
                          <Image src={item.image || "/placeholder.svg"} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRange(item.priceMin, item.priceMax, item.priceType)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-secondary rounded"><Minus className="h-3 w-3" /></button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-secondary rounded"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-destructive p-1 hover:bg-destructive/10 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3 mt-3 flex justify-between items-center font-bold text-lg">
                      <span>Total Estimate:</span>
                      <span className="text-primary">
                        {totalMin === totalMax ? formatJPY(totalMin) : `${formatJPY(totalMin)}-${formatJPY(totalMax)}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Booking Form */}
            <FadeIn delay={0.3}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 ticktoc-shadow border border-border">
                <h3 className="font-serif text-lg font-bold mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t("name")} <span className="text-destructive">*</span></Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t("name") + "..."} />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="090..." />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">{t("email")} <span className="text-destructive">*</span></Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="name@example.com" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <Label htmlFor="people">{t("people")} <span className="text-destructive">*</span></Label>
                      <Input id="people" type="number" min="1" value={formData.people} onChange={e => setFormData({ ...formData, people: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="date">{t("date")} <span className="text-destructive">*</span></Label>
                      <Input id="date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="time">{tCommon("arrivalTime") || "Approx. Arrival Time"} <span className="text-destructive">*</span></Label>
                    <Input id="time" type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="note">{t("note")}</Label>
                    <textarea
                      id="note"
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder={t("notePlaceholder")}
                      value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Request & Quote"}
                  </Button>
                </div>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </main>
  );
}
