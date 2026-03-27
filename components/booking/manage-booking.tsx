'use client';

import { useState } from 'react';
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
    Minus
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
    onUpdate: () => void;
}

export function ManageBooking({ booking: initialBooking, onUpdate }: ManageBookingProps) {
    const t = useTranslations('booking');
    const [booking, setBooking] = useState(initialBooking);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/bookings/${booking.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                    items: booking.items
                })
            });

            if (!response.ok) throw new Error('Update failed');
            
            toast.success(t('updateSuccess'));
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Update error:', error);
            toast.error(t('lookupError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/bookings/${booking.id}/cancel`, {
                method: 'PUT'
            });

            if (!response.ok) throw new Error('Cancel failed');
            
            toast.success(t('cancelSuccess'));
            onUpdate();
        } catch (error) {
            console.error('Cancel error:', error);
            toast.error(t('lookupError'));
        } finally {
            setLoading(false);
        }
    };

    const isCancelled = booking.status === 'Cancelled';

    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden",
            isExpanded ? "ring-2 ring-primary/20 shadow-2xl" : "shadow hover:shadow-md border-primary/5"
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
                                            <Input 
                                                type="date"
                                                value={booking.bookingDate ? booking.bookingDate.split('T')[0] : ''}
                                                onChange={(e) => setBooking({...booking, bookingDate: e.target.value})}
                                                className="bg-white border-primary/20"
                                            />
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

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">{t('childAges')}</Label>
                                        <Input 
                                            value={booking.childAges || ''}
                                            onChange={(e) => setBooking({...booking, childAges: e.target.value})}
                                            placeholder={t('childAgesPlaceholder')}
                                            className="bg-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">{t('extraServices')}</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button 
                                                type="button"
                                                size="sm"
                                                variant={(booking.extraServices || '').includes('Chụp ảnh') ? "default" : "outline"}
                                                onClick={() => {
                                                    let services = (booking.extraServices || '').split(', ').filter((s: string) => s);
                                                    if (services.includes('Chụp ảnh')) {
                                                        services = services.filter((s: string) => s !== 'Chụp ảnh');
                                                    } else {
                                                        services.push('Chụp ảnh');
                                                    }
                                                    setBooking({...booking, extraServices: services.join(', ')});
                                                }}
                                                className="rounded-full text-[10px] h-7"
                                            >
                                                📸 {t('photoService')}
                                            </Button>
                                            <Button 
                                                type="button"
                                                size="sm"
                                                variant={(booking.extraServices || '').includes('Makeup') ? "default" : "outline"}
                                                onClick={() => {
                                                    let services = (booking.extraServices || '').split(', ').filter((s: string) => s);
                                                    if (services.includes('Makeup')) {
                                                        services = services.filter((s: string) => s !== 'Makeup');
                                                    } else {
                                                        services.push('Makeup');
                                                    }
                                                    setBooking({...booking, extraServices: services.join(', ')});
                                                }}
                                                className="rounded-full text-[10px] h-7"
                                            >
                                                💄 {t('makeupService')}
                                            </Button>
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
                                <div className="space-y-4">
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
                                        <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">{t('searchButton') || 'Xác nhận hủy'}</AlertDialogAction>
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
                                    <Button onClick={() => setIsEditing(true)} className="gap-2 font-bold">
                                        {t('updateBooking') || 'Thay đổi thông tin'}
                                    </Button>
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
