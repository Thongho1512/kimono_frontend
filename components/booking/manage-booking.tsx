'use client';

import { useState } from 'react';
import { format } from 'date-fns';
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
    ChevronUp
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
                    note: booking.note,
                    items: booking.items
                })
            });

            if (!response.ok) throw new Error('Update failed');
            
            toast.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Không thể cập nhật. Vui lòng thử lại.');
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
            
            toast.success('Hủy đặt lịch thành công!');
            onUpdate();
        } catch (error) {
            console.error('Cancel error:', error);
            toast.error('Không thể hủy lúc này. Vui lòng liên hệ hotline.');
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
                                <Badge variant="destructive" className="bg-red-100 text-red-700 border-none px-2 py-0.5 text-[10px] font-bold">ĐÃ HỦY</Badge>
                            ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-none px-2 py-0.5 text-[10px] font-bold">XÁC NHẬN</Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {booking.arrivalTime}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {booking.numberOfPeople} người</span>
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
                        {/* Column 1: Customer Contact */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="h-4 w-1 bg-primary rounded-full" />
                                Thông tin cá nhân
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">HỌ VÀ TÊN</Label>
                                    <Input 
                                        disabled={!isEditing || isCancelled}
                                        value={booking.customerName}
                                        onChange={(e) => setBooking({...booking, customerName: e.target.value})}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">SỐ ĐIỆN THOẠI</Label>
                                        <Input 
                                            disabled={!isEditing || isCancelled}
                                            value={booking.customerPhone}
                                            onChange={(e) => setBooking({...booking, customerPhone: e.target.value})}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">EMAIL</Label>
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

                        {/* Column 2: Booking specifics */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="h-4 w-1 bg-primary rounded-full" />
                                Chi tiết dịch vụ
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">GIỜ ĐẾN</Label>
                                        <Input 
                                            type="time"
                                            disabled={!isEditing || isCancelled}
                                            value={booking.arrivalTime}
                                            onChange={(e) => setBooking({...booking, arrivalTime: e.target.value})}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">SỐ NGƯỜI</Label>
                                        <Input 
                                            type="number"
                                            disabled={!isEditing || isCancelled}
                                            value={booking.numberOfPeople}
                                            onChange={(e) => setBooking({...booking, numberOfPeople: parseInt(e.target.value) || 1})}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">GHI CHÚ</Label>
                                    <Textarea 
                                        disabled={!isEditing || isCancelled}
                                        value={booking.note || ''}
                                        onChange={(e) => setBooking({...booking, note: e.target.value})}
                                        className="bg-white min-h-[80px]"
                                        placeholder="Không có ghi chú nào..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {!isCancelled && (
                        <div className="flex flex-wrap items-center justify-between border-t pt-6 gap-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-bold px-0">
                                        <Trash2 className="h-4 w-4" />
                                        Hủy đơn đặt lịch này
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Bạn có chắc chắn muốn hủy?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Thao tác này sẽ đánh dấu đơn đặt lịch của bạn là "Đã hủy" trong hệ thống. Bạn không thể hoàn tác thao tác này.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Quay lại</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">Xác nhận hủy</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <div className="flex gap-3 ml-auto">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={() => { setBooking(initialBooking); setIsEditing(false); }} disabled={loading}>
                                            Hủy thay đổi
                                        </Button>
                                        <Button onClick={handleSave} disabled={loading} className="gap-2 bg-primary font-bold shadow-lg shadow-primary/20">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            Lưu cập nhật
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} className="gap-2 font-bold">
                                        Thay đổi thông tin
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {isCancelled && (
                        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 text-red-700 dark:text-red-300">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-sm font-medium">Lịch này đã bị hủy. Bạn không thể thay đổi thông tin. Vui lòng đặt lịch mới nếu cần thiết.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
