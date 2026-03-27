"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { FadeIn } from "@/components/ticktoc/fade-in";
import { PageBreadcrumb } from "@/components/ticktoc/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ShoppingBag, Trash2, Plus, Minus, AlertCircle, Phone, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { formatJPY } from "@/lib/data";

import { toast } from "sonner";

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

function BookingForm({ initialProducts = [] }: { initialProducts?: ProductDto[] }) {
  const t = useTranslations("booking");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedPlanId = searchParams.get("plan");

  const [products, setProducts] = useState<ProductDto[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "09:00",
    people: "1",
    note: "",
  });

  const [extraInfo, setExtraInfo] = useState({
    adultMale: 0,
    adultFemale: 0,
    childMale: 0,
    childFemale: 0,
    children: [] as { id: string; gender: "male" | "female"; age: string }[],
    photoService: false,
    makeupService: false,
  });

  const addChild = (gender: "male" | "female") => {
    setExtraInfo((p) => ({
      ...p,
      [gender === "male" ? "childMale" : "childFemale"]: p[gender === "male" ? "childMale" : "childFemale"] + 1,
      children: [...p.children, { id: Math.random().toString(36).substr(2, 9), gender, age: "" }],
    }));
  };

  const removeChild = (gender: "male" | "female") => {
    setExtraInfo((p) => {
      if (p[gender === "male" ? "childMale" : "childFemale"] <= 0) return p;
      const lastIndex = [...p.children].reverse().findIndex((c) => c.gender === gender);
      if (lastIndex === -1) return p;
      const actualIndex = p.children.length - 1 - lastIndex;
      const newChildren = [...p.children];
      newChildren.splice(actualIndex, 1);
      return {
        ...p,
        [gender === "male" ? "childMale" : "childFemale"]: p[gender === "male" ? "childMale" : "childFemale"] - 1,
        children: newChildren,
      };
    });
  };

  const updateChildAge = (id: string, age: string) => {
    setExtraInfo((p) => ({
      ...p,
      children: p.children.map((c) => (c.id === id ? { ...c, age } : c)),
    }));
  };

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
    toast.success(t("addedToCart"));
  };

  useEffect(() => {
    const total = extraInfo.adultMale + extraInfo.adultFemale + extraInfo.childMale + extraInfo.childFemale;
    if (total > 0) {
      setFormData((prev) => ({ ...prev, people: total.toString() }));
    }
  }, [extraInfo.adultMale, extraInfo.adultFemale, extraInfo.childMale, extraInfo.childFemale]);

  useEffect(() => {
    if (initialProducts.length > 0) {
      if (preselectedPlanId) {
        const product = initialProducts.find((p: ProductDto) => p.id === preselectedPlanId);
        if (product) addToCart(product);
      }
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await api.get(`/api/public/products?culture=${locale}`);
        setProducts(res.data);
        if (preselectedPlanId && res.data) {
          const product = res.data.find((p: ProductDto) => p.id === preselectedPlanId);
          if (product) addToCart(product);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [locale, initialProducts, preselectedPlanId]);

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
      toast.error(t("pleaseSelectService"));
      return false;
    }
    if (!formData.name.trim()) {
      toast.error(t("pleaseEnterName"));
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error(t("pleaseEnterPhone"));
      return false;
    }
    if (!formData.email.trim()) {
      toast.error(t("pleaseEnterEmail"));
      return false;
    }
    if (!formData.date) {
      toast.error(t("pleaseSelectDate"));
      return false;
    }
    if (!formData.time) {
      toast.error(t("pleaseSelectTime"));
      return false;
    }
    if (!formData.people || parseInt(formData.people) < 1) {
      toast.error(t("pleaseEnterPeople"));
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
      adultMale: extraInfo.adultMale,
      adultFemale: extraInfo.adultFemale,
      childMale: extraInfo.childMale,
      childFemale: extraInfo.childFemale,
      childAges: extraInfo.children.map((c, i) => `${c.gender === "male" ? "Bé trai" : "Bé gái"} ${i+1}: ${c.age || "chưa rõ"} tuổi`).join(", "),
      extraServices: [extraInfo.photoService && "Chụp ảnh", extraInfo.makeupService && "Makeup"].filter(Boolean).join(", "),
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
      const response = await api.post('/api/public/bookings/send-email', payload);
      if (response.data.success) {
        router.push(`/${locale}/booking/thank-you`);
        setCart([]);
      } else {
        toast.error(response.data.message || "Booking failed.");
      }
    } catch (error: any) {
      console.error("Booking submission error", error);
      const errorMsg = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

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

      <FadeIn delay={0.1}>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-4 flex gap-3 items-start shadow-sm">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 dark:text-amber-400 text-base">{t("policyTitle")}</h4>
            <p className="text-amber-800 dark:text-amber-300/80 text-sm leading-relaxed">
              {t("policyText")}
            </p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8 flex gap-3 items-center shadow-sm">
          <Calendar className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground">
              {locale === 'vi' ? 'Đã có lịch hẹn? ' : (locale === 'en' ? 'Already have a booking? ' : (locale === 'ja' ? 'すでにご予約をお持ちですか？ ' : (locale === 'ko' ? '이미 예약하셨나요? ' : '已有预约？ ')))}
              <Link href={`/${locale}/booking/lookup`} className="font-bold text-primary hover:underline underline-offset-4">
                {locale === 'vi' ? 'Tra cứu và quản lý tại đây' : (locale === 'en' ? 'Lookup and manage here' : (locale === 'ja' ? 'こちらで照会・管理できます' : (locale === 'ko' ? '여기에서 조회 및 quản lý할 수 있습니다' : '在此查询和管理')))}
              </Link>
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
        <div className="lg:col-span-7 space-y-6">
          <FadeIn delay={0.1}>
            <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              {t("selectServices")}
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
                      <Plus className="h-3 w-3 mr-1" /> {t("add")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <FadeIn delay={0.2}>
              <div className="bg-card rounded-2xl p-6 ticktoc-shadow border border-border">
                <h3 className="font-serif text-lg font-bold mb-4">{t("yourSelection")}</h3>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-secondary/30 rounded-lg border border-dashed border-border">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t("noItemsSelected")}</p>
                    <p className="text-xs">{t("selectFromList")}</p>
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
                      <span>{t("totalEstimate")}</span>
                      <span className="text-primary">
                        {totalMin === totalMax ? formatJPY(totalMin) : `${formatJPY(totalMin)}-${formatJPY(totalMax)}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 ticktoc-shadow border border-border">
                <h3 className="font-serif text-lg font-bold mb-4">{t("contactInfo")}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t("name")} <span className="text-destructive">*</span></Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t("name") + "..."} />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")} <span className="text-destructive">*</span></Label>
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
                    <Label htmlFor="time">{t("arrivalTime")} <span className="text-destructive">*</span></Label>
                    <Input id="time" type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                  
                  <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border">
                    <Label className="font-semibold">{t("customerDetails") || "Chi tiết đoàn khách"}</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t("adultMale") || "Nam (Người lớn)"}</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setExtraInfo(p => ({...p, adultMale: Math.max(0, p.adultMale - 1)}))}><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 text-center text-sm">{extraInfo.adultMale}</span>
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setExtraInfo(p => ({...p, adultMale: p.adultMale + 1}))}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t("adultFemale") || "Nữ (Người lớn)"}</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setExtraInfo(p => ({...p, adultFemale: Math.max(0, p.adultFemale - 1)}))}><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 text-center text-sm">{extraInfo.adultFemale}</span>
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setExtraInfo(p => ({...p, adultFemale: p.adultFemale + 1}))}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t("childMale") || "Bé trai (Trẻ em)"}</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => removeChild("male")}><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 text-center text-sm">{extraInfo.childMale}</span>
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => addChild("male")}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t("childFemale") || "Bé gái (Trẻ em)"}</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => removeChild("female")}><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 text-center text-sm">{extraInfo.childFemale}</span>
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => addChild("female")}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                    {extraInfo.children.length > 0 && (
                      <div className="space-y-3 pt-2 border-t border-border mt-2 animate-in fade-in slide-in-from-top-1">
                        <Label className="text-sm font-medium">{t("childAgesInputTitle") || "Vui lòng nhập độ tuổi của từng bé"}</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {extraInfo.children.map((child, index) => (
                            <div key={child.id} className="relative">
                              <Label className="text-[10px] absolute -top-2 left-2 bg-background px-1 z-10 text-primary font-bold uppercase transition-all">
                                {child.gender === "male" ? "Bé trai" : "Bé gái"} {extraInfo.children.filter((c, i) => c.gender === child.gender && i <= index).length}
                              </Label>
                              <Input placeholder="Số tuổi..." className="h-9 pt-1" value={child.age} onChange={(e) => updateChildAge(child.id, e.target.value)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                    <Label className="font-semibold">{t("extraServices") || "Dịch vụ đi kèm"}</Label>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <Button type="button" variant={extraInfo.photoService ? "default" : "outline"} onClick={() => setExtraInfo(p => ({...p, photoService: !p.photoService}))} className="rounded-full shadow-sm transition-all">📸 Chụp ảnh</Button>
                      <Button type="button" variant={extraInfo.makeupService ? "default" : "outline"} onClick={() => setExtraInfo(p => ({...p, makeupService: !p.makeupService}))} className="rounded-full shadow-sm transition-all">💄 Makeup</Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-1">
                    <input type="checkbox" id="agree" className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    <Label htmlFor="agree" className="text-xs text-muted-foreground cursor-pointer select-none">{t("agreePolicy")}</Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting || !agreed}>
                    {submitting ? t("sending") : t("submit")}
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

export default function BookingFormRoot({ initialProducts }: { initialProducts?: ProductDto[] }) {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <BookingForm initialProducts={initialProducts} />
    </Suspense>
  );
}
