'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { 
    Calendar as CalendarIcon, 
    Clock, 
    Users, 
    User, 
    Phone, 
    Mail, 
    Trash2, 
    Save, 
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    Plus,
    Minus,
    ShoppingBag,
    X,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ManageBookingProps {
    booking: any;
    onUpdate: (updatedData?: any) => void;
}

interface ProductDto {
  id: string;
  name: string;
  rentalPricePerDay: number;
  rentalPriceMin: number;
  rentalPriceMax: number;
  priceType: string;
  images: { url: string }[];
}

export function ManageBooking({ booking: initialBooking, onUpdate }: ManageBookingProps) {
    const t = useTranslations('booking');
    const [booking, setBooking] = useState(initialBooking);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [products, setProducts] = useState<(ProductDto & { categoryNameTranslated?: string })[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [childAgesList, setChildAgesList] = useState<{id: string, age: string}[]>([]);

    useEffect(() => {
        if (isEditing && products.length === 0) {
            const fetchProducts = async () => {
                try {
                    const res = await api.get(`/api/public/products?culture=${initialBooking.culture || 'vi'}`);
                    setProducts(res.data);
                } catch (error) {
                    console.error("Failed to fetch products", error);
                }
            };
            fetchProducts();
        }
    }, [isEditing]);

    useEffect(() => {
        // Parse child ages string into list
        if (booking.childAges) {
            const ages = booking.childAges.split(', ').map((s: string, i: number) => ({
                id: `child-${i}`,
                age: s.includes(':') ? s.split(': ')[1].replace(' tuổi', '') : s
            }));
            setChildAgesList(ages);
        } else {
            const totalChildren = (booking.childMale || 0) + (booking.childFemale || 0);
            setChildAgesList(Array.from({length: totalChildren}, (_, i) => ({ id: `child-${i}`, age: "" })));
        }
    }, [booking.id]); // Only on load/id change

    // Sync childAgesList with guest counts
    useEffect(() => {
        const totalChildren = (booking.childMale || 0) + (booking.childFemale || 0);
        if (childAgesList.length !== totalChildren) {
            if (childAgesList.length < totalChildren) {
                // Add more
                const diff = totalChildren - childAgesList.length;
                setChildAgesList([...childAgesList, ...Array.from({length: diff}, (_, i) => ({ id: `new-${childAgesList.length + i}`, age: "" }))]);
            } else {
                // Remove some
                setChildAgesList(childAgesList.slice(0, totalChildren));
            }
        }
    }, [booking.childMale, booking.childFemale]);

    const updateChildAge = (id: string, age: string) => {
        const newList = childAgesList.map(c => c.id === id ? { ...c, age } : c);
        setChildAgesList(newList);
        
        // Update booking state with comma string
        const summaries = newList.map((c, i) => {
            const isMale = i < (booking.childMale || 0);
            const genderText = isMale ? "Bé trai" : "Bé gái";
            const genderIdx = isMale ? i + 1 : (i - (booking.childMale || 0) + 1);
            return `${genderText} ${genderIdx}: ${c.age || "chưa rõ"} tuổi`;
        });
        setBooking({...booking, childAges: summaries.join(", ")});
    };

    const addToItems = (product: ProductDto) => {
        const existing = (booking.items || []).find((item: any) => item.productId === product.id);
        if (existing) {
            const newItems = booking.items.map((item: any) => 
                item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setBooking({...booking, items: newItems});
        } else {
            const newItem = {
                productId: product.id,
                productName: product.name,
                price: product.rentalPriceMin > 0 ? product.rentalPriceMin : product.rentalPricePerDay,
                priceMin: product.rentalPriceMin,
                priceMax: product.rentalPriceMax,
                quantity: 1,
                product: product // Keep for image display
            };
            setBooking({...booking, items: [...(booking.items || []), newItem]});
        }
        toast.success(t('addedToCart'));
    };

    const updateItemQuantity = (productId: string, delta: number) => {
        const newItems = booking.items.map((item: any) => {
            if (item.productId === productId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setBooking({...booking, items: newItems});
    };

    const removeItem = (productId: string) => {
        const newItems = booking.items.filter((item: any) => item.productId !== productId);
        setBooking({...booking, items: newItems});
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await api.put(`/api/public/bookings/${booking.id}`, {
                customerName: booking.customerName,
                customerPhone: booking.customerPhone,
                customerEmail: booking.customerEmail,
                bookingDate: booking.bookingDate,
                arrivalTime: booking.arrivalTime,
                numberOfPeople: booking.numberOfPeople,
                adultMale: booking.adultMale,
                adultFemale: booking.adultFemale,
                childMale: booking.childMale,
                childFemale: booking.childFemale,
                childAges: booking.childAges,
                extraServices: booking.extraServices,
                note: booking.note,
                items: (booking.items || []).map((item: any) => ({
                    productId: item.productId,
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity
                }))
            });

            if (!response.data.success) throw new Error('Update failed');
            
            toast.success(t('updateSuccess'));
            setIsEditing(false);
            onUpdate(response.data.booking || booking);
        } catch (error: any) {
            console.error('Update error:', error);
            const backendMsg = error.response?.data?.message;
            toast.error(backendMsg || t('lookupError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            setLoading(true);
            const response = await api.delete(`/api/public/bookings/${booking.id}`);

            if (!response.data.success) throw new Error('Delete failed');
            
            toast.success(t('cancelSuccess'));
            setIsDeleting(true);
            setTimeout(() => {
                onUpdate();
            }, 300);
        } catch (error: any) {
            console.error('Cancel error:', error);
            const backendMsg = error.response?.data?.message;
            toast.error(backendMsg || t('lookupError'));
        } finally {
            setLoading(false);
        }
    };

    const isCancelled = booking.status === 'Cancelled';

    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden",
            isExpanded ? "ring-2 ring-primary/20 shadow-2xl" : "shadow hover:shadow-md border-primary/5",
            isDeleting && "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}>
            {/* Header / Summary */}
            <div 
                className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{format(new Date(booking.bookingDate), 'dd/MM/yyyy')}</span>
                            {isCancelled ? (
                                <Badge variant="destructive" className="bg-red-100 text-red-700 border-none px-2 py-0.5 text-[10px] font-bold uppercase">{t('status_cancelled') || 'ĐÃ HỦY'}</Badge>
                            ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-none px-2 py-0.5 text-[10px] font-bold uppercase">{t('status_confirmed') || 'XÁC NHẬN'}</Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {booking.arrivalTime}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {booking.numberOfPeople} {t('people')}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isExpanded && (
                        <div className="hidden sm:block text-right">
                            <p className="font-medium text-slate-700 dark:text-slate-300">{booking.customerName}</p>
                            <p className="text-xs text-slate-500">{booking.customerPhone}</p>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="rounded-full">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 border-t bg-slate-50/30 dark:bg-slate-900/10 space-y-8 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Items Selection (Editing) */}
                        {isEditing && !isCancelled && (
                            <div className="md:col-span-2 space-y-4 pb-4 border-b">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4" />
                                    {t('selectServices') || "Chọn loại Kimono"}
                                </h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Search & Add */}
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                placeholder={t('searchProducts') || "Tìm kiếm sản phẩm..."}
                                                className="pl-9 bg-white"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="bg-white border rounded-xl p-2 max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar shadow-inner">
                                            {products
                                                .filter(p => !searchQuery || 
                                                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                    (p.categoryNameTranslated && p.categoryNameTranslated.toLowerCase().includes(searchQuery.toLowerCase()))
                                                )
                                                .map(product => {
                                                    const isRange = product.priceType === "range" || product.priceType === "Khoảng";
                                                    const priceText = isRange 
                                                        ? `${product.rentalPriceMin.toLocaleString()} - ${product.rentalPriceMax.toLocaleString()} ¥` 
                                                        : `${(product.rentalPriceMin > 0 ? product.rentalPriceMin : product.rentalPricePerDay).toLocaleString()} ¥`;
                                                    
                                                    return (
                                                        <div 
                                                            key={product.id} 
                                                            className="flex items-center justify-between p-2.5 hover:bg-primary/5 rounded-xl group cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-200"
                                                            onClick={() => addToItems(product)}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-10 relative rounded-lg overflow-hidden bg-slate-100 shadow-sm">
                                                                    <Image 
                                                                        src={product.images?.[0]?.url || "/placeholder.svg"} 
                                                                        alt={product.name} 
                                                                        fill 
                                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <p className="text-[10px] text-primary font-bold tracking-wider leading-none">
                                                                        {product.categoryNameTranslated || "SẢN PHẨM"} — {product.name}
                                                                    </p>
                                                                    <p className="text-xs font-semibold text-slate-700 leading-tight">
                                                                        {isRange ? `Khoảng giá: ${priceText}` : priceText}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            {products.length === 0 && <p className="text-xs text-center py-6 text-muted-foreground italic">Đang tải sản phẩm...</p>}
                                        </div>
                                    </div>

                                    {/* Current Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                            {t('yourSelection') || "Lựa chọn của bạn"}
                                            <Badge variant="outline" className="text-[10px] font-normal">{(booking.items || []).length} items</Badge>
                                        </Label>
                                        <div className="space-y-2">
                                            {(booking.items || []).map((item: any) => (
                                                <div key={item.productId} className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                    <div className="h-12 w-10 relative rounded overflow-hidden bg-slate-50">
                                                        <Image 
                                                            src={item.product?.images?.[0]?.url || item.image || "/placeholder.svg"} 
                                                            alt={item.productName} 
                                                            fill 
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold truncate leading-none mb-1">{item.productName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-5 w-5 rounded-md hover:bg-white"
                                                                    onClick={(e) => { e.stopPropagation(); updateItemQuantity(item.productId, -1); }}
                                                                >
                                                                    <Minus className="h-2 w-2" />
                                                                </Button>
                                                                <span className="w-5 text-center text-[10px] font-bold">{item.quantity}</span>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-5 w-5 rounded-md hover:bg-white"
                                                                    onClick={(e) => { e.stopPropagation(); updateItemQuantity(item.productId, 1); }}
                                                                >
                                                                    <Plus className="h-2 w-2" />
                                                                </Button>
                                                            </div>
                                                            <span className="text-[10px] text-primary font-bold">
                                                                {((item.price * item.quantity)).toLocaleString()} ¥
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-7 w-7 text-slate-400 hover:text-red-500 rounded-full"
                                                        onClick={(e) => { e.stopPropagation(); removeItem(item.productId); }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {(booking.items || []).length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                                    <ShoppingBag className="h-8 w-8 text-slate-200 mb-2" />
                                                    <p className="text-xs text-muted-foreground">{t('noItemsSelected') || "Chưa chọn sản phẩm nào"}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Column 1: Customer Contact & Main Details */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <div className="h-4 w-1 bg-primary rounded-full" />
                                    {t('contactInfo')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">{t('name')}</Label>
                                        <Input 
                                            disabled={!isEditing || isCancelled}
                                            value={booking.customerName}
                                            onChange={(e) => setBooking({...booking, customerName: e.target.value})}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">{t('phone')}</Label>
                                            <Input 
                                                disabled={!isEditing || isCancelled}
                                                value={booking.customerPhone}
                                                onChange={(e) => setBooking({...booking, customerPhone: e.target.value})}
                                                className="bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">{t('email')}</Label>
                                            <Input 
                                                disabled={!isEditing || isCancelled}
                                                value={booking.customerEmail}
                                                onChange={(e) => setBooking({...booking, customerEmail: e.target.value})}
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time (Editing) */}
                            {isEditing && !isCancelled && (
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-primary uppercase">{t('date')}</Label>
                                            <div className="space-y-1">
                                                <Input 
                                                    type="date"
                                                    value={booking.bookingDate ? booking.bookingDate.split('T')[0] : ''}
                                                    onChange={(e) => setBooking({...booking, bookingDate: e.target.value})}
                                                    className="bg-white border-primary/20"
                                                />
                                                <p className="text-[10px] text-muted-foreground italic">{t('dateFormatHint') || "Định dạng: tháng/ngày/năm"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-primary uppercase">{t('arrivalTime')}</Label>
                                            <Input 
                                                type="time"
                                                value={booking.arrivalTime}
                                                onChange={(e) => setBooking({...booking, arrivalTime: e.target.value})}
                                                className="bg-white border-primary/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-primary uppercase">{t('people')}</Label>
                                        <div className="flex items-center gap-3">
                                            <Input 
                                                type="number"
                                                value={booking.numberOfPeople}
                                                onChange={(e) => setBooking({...booking, numberOfPeople: parseInt(e.target.value) || 1})}
                                                className="bg-white w-24"
                                            />
                                            <span className="text-xs text-muted-foreground italic">({t('totalPeopleHint') || "Tổng số người dự kiến"})</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Column 2: Specific Details & Breakdown */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="h-4 w-1 bg-primary rounded-full" />
                                {t('customerDetails')}
                            </h3>
                            
                            {/* Breakdown (Editing) */}
                            {isEditing && !isCancelled ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">{t('adults') || "Người lớn"}</Label>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-muted-foreground uppercase">{t('adultMale')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, adultMale: Math.max(0, (booking.adultMale || 0) - 1)})}><Minus className="h-3 w-3" /></Button>
                                                        <span className="w-4 text-center font-medium">{booking.adultMale || 0}</span>
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, adultMale: (booking.adultMale || 0) + 1})}><Plus className="h-3 w-3" /></Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-muted-foreground uppercase">{t('adultFemale')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, adultFemale: Math.max(0, (booking.adultFemale || 0) - 1)})}><Minus className="h-3 w-3" /></Button>
                                                        <span className="w-4 text-center font-medium">{booking.adultFemale || 0}</span>
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, adultFemale: (booking.adultFemale || 0) + 1})}><Plus className="h-3 w-3" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">{t('children') || "Trẻ em"}</Label>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-muted-foreground uppercase">{t('childMale')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, childMale: Math.max(0, (booking.childMale || 0) - 1)})}><Minus className="h-3 w-3" /></Button>
                                                        <span className="w-4 text-center font-medium">{booking.childMale || 0}</span>
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, childMale: (booking.childMale || 0) + 1})}><Plus className="h-3 w-3" /></Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-muted-foreground uppercase">{t('childFemale')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, childFemale: Math.max(0, (booking.childFemale || 0) - 1)})}><Minus className="h-3 w-3" /></Button>
                                                        <span className="w-4 text-center font-medium">{booking.childFemale || 0}</span>
                                                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setBooking({...booking, childFemale: (booking.childFemale || 0) + 1})}><Plus className="h-3 w-3" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">{t('childAges')}</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {childAgesList.map((child, idx) => (
                                                <div key={child.id} className="space-y-1">
                                                    <Label className="text-[10px] text-muted-foreground">
                                                        {idx < (booking.childMale || 0) ? `${t('boy')} ${idx + 1}` : `${t('girl')} ${idx - (booking.childMale || 0) + 1}`}
                                                    </Label>
                                                    <Input 
                                                        value={child.age}
                                                        onChange={(e) => updateChildAge(child.id, e.target.value)}
                                                        placeholder={t('agePlaceholder') || "Tuổi..."}
                                                        className="bg-white h-8 text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">{t('extraServices')}</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Show current services as tags with X */}
                                            {(booking.extraServices || '').split(', ').filter((s: string) => s).map((service: string) => (
                                                <Badge key={service} variant="secondary" className="gap-1 py-1 px-3 bg-primary/10 text-primary border-primary/20">
                                                    {service === 'Chụp ảnh' ? '📸 ' : (service === 'Makeup' ? '💄 ' : '')}
                                                    {service === 'Chụp ảnh' ? t('photoService') : (service === 'Makeup' ? t('makeupService') : service)}
                                                    <button 
                                                        onClick={() => {
                                                            const services = (booking.extraServices || '').split(', ').filter((s: string) => s !== service);
                                                            setBooking({...booking, extraServices: services.join(', ')});
                                                        }}
                                                        className="ml-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                            
                                            {/* Quick add buttons if not present */}
                                            {!(booking.extraServices || '').includes('Chụp ảnh') && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="rounded-full text-[10px] h-7 dashed border-dashed bg-slate-50/50"
                                                    onClick={() => {
                                                        const services = (booking.extraServices || '').split(', ').filter((s: string) => s);
                                                        services.push('Chụp ảnh');
                                                        setBooking({...booking, extraServices: services.join(', ')});
                                                    }}
                                                >
                                                    <Plus className="h-3 w-3 mr-1" /> {t('photoService')}
                                                </Button>
                                            )}
                                            {!(booking.extraServices || '').includes('Makeup') && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="rounded-full text-[10px] h-7 dashed border-dashed bg-slate-50/50"
                                                    onClick={() => {
                                                        const services = (booking.extraServices || '').split(', ').filter((s: string) => s);
                                                        services.push('Makeup');
                                                        setBooking({...booking, extraServices: services.join(', ')});
                                                    }}
                                                >
                                                    <Plus className="h-3 w-3 mr-1" /> {t('makeupService')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">{t('note')}</Label>
                                        <Textarea 
                                            value={booking.note || ''}
                                            onChange={(e) => setBooking({...booking, note: e.target.value})}
                                            className="bg-white min-h-[80px] text-sm"
                                            placeholder="..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Appointment details summary */}
                                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">{t('appointmentDate')}</Label>
                                            <p className="text-sm font-bold text-primary flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4" />
                                                {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">{t('arrivalTime')}</Label>
                                            <p className="text-sm font-bold text-primary flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {booking.arrivalTime}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-muted-foreground italic flex items-center gap-2">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {t('creationDate')}: {booking.createdAt ? format(new Date(booking.createdAt), 'HH:mm dd/MM/yyyy') : 'chưa có dữ liệu'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Booked Items (View Mode) */}
                                    {(booking.items || []).length > 0 && (
                                        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <ShoppingBag className="h-3 w-3 text-primary" />
                                                {t('yourSelection') || "Sản phẩm đã chọn"}
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {booking.items.map((item: any) => (
                                                    <div key={item.productId} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100/50 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                                                        <div className="h-10 w-8 relative rounded overflow-hidden bg-slate-50 dark:bg-slate-800">
                                                            <Image 
                                                                src={item.product?.images?.[0]?.url || item.image || "/placeholder.svg"} 
                                                                alt={item.productName} 
                                                                fill 
                                                                className="object-cover"
                                                                sizes="40px"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold truncate leading-tight mb-0.5">{item.productName}</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Số lượng: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">{t('adults')}</Label>
                                            <p className="text-sm font-medium">{booking.adultMale || 0} Nam, {booking.adultFemale || 0} Nữ</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">{t('children')}</Label>
                                            <p className="text-sm font-medium">{booking.childMale || 0} Nam, {booking.childFemale || 0} Nữ</p>
                                        </div>
                                    </div>
                                    
                                    {booking.childAges && (
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">{t('childAges')}</Label>
                                            <p className="text-sm text-slate-600 italic">"{booking.childAges}"</p>
                                        </div>
                                    )}

                                    {booking.extraServices && (
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">{t('extraServices')}</Label>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {booking.extraServices.split(', ').map((s: string) => (
                                                    <Badge key={s} variant="secondary" className="text-[10px] font-normal">{s}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {booking.note && (
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">{t('note')}</Label>
                                            <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100">{booking.note}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {!isCancelled && (
                        <div className="flex flex-wrap items-center justify-between border-t pt-6 gap-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-bold px-0">
                                        <Trash2 className="h-4 w-4" />
                                        {t('cancelBooking') || 'Hủy đơn đặt lịch này'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t('confirmCancel')}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t('cancelWarning')}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('back')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">{t('confirm')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <div className="flex gap-3 ml-auto">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={() => { setBooking(initialBooking); setIsEditing(false); }} disabled={loading}>
                                            {t('back')}
                                        </Button>
                                        <Button onClick={handleSave} disabled={loading} className="gap-2 bg-primary font-bold shadow-lg shadow-primary/20">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            {t('submit')}
                                        </Button>
                                    </>
                                ) : (
                                    /* <Button onClick={() => setIsEditing(true)} className="gap-2 font-bold">
                                        {t('updateBooking') || 'Thay đổi thông tin'}
                                    </Button> */
                                    null
                                )}
                            </div>
                        </div>
                    )}

                    {isCancelled && (
                        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 text-red-700 dark:text-red-300">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-sm font-medium">{t('cancelWarning')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
