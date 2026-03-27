'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
    X, 
    User, 
    Phone, 
    Mail, 
    Calendar as CalendarIcon, 
    Clock, 
    Users, 
    FileText, 
    CreditCard,
    CheckCircle2,
    XCircle,
    Info,
    Trash2
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface BookingDetailsProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function BookingDetails({ id, isOpen, onClose, onUpdate }: BookingDetailsProps) {
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/bookings/${id}`);
            if (!response.ok) throw new Error('Failed to fetch details');
            const data = await response.json();
            setBooking(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể tải chi tiết đơn đặt lịch');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail();
        }
    }, [isOpen, id]);

    const handleUpdateStatus = async (status: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/bookings/${id}/status?status=${status}`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('Failed to update status');
            toast.success('Cập nhật trạng thái thành công');
            fetchDetail();
            onUpdate();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xóa đơn đặt lịch này?')) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/bookings/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete');
            toast.success('Xóa thành công');
            onClose();
            onUpdate();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể xóa đơn đặt lịch');
        }
    };

    if (!isOpen) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-xl overflow-y-auto custom-scrollbar p-0 border-none shadow-2xl">
                <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b p-6">
                    <SheetHeader className="flex flex-row items-center justify-between space-y-0">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                            Chi tiết đơn đặt lịch
                        </SheetTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </SheetHeader>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-muted-foreground animate-pulse">Đang tải chi tiết...</p>
                    </div>
                ) : booking ? (
                    <div className="p-6 space-y-8">
                        {/* Status Header */}
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</p>
                                {booking.status === 'Cancelled' ? (
                                    <Badge variant="destructive" className="gap-1.5 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-100 border-none font-semibold">
                                        <XCircle className="h-4 w-4" />
                                        ĐÃ HỦY
                                    </Badge>
                                ) : (
                                    <Badge variant="default" className="gap-1.5 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-100 border-none font-semibold">
                                        <CheckCircle2 className="h-4 w-4" />
                                        ĐÃ XÁC NHẬN
                                    </Badge>
                                )}
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mã đơn</p>
                                <p className="font-mono text-sm font-bold">#{booking.id.split('-')[0].toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="h-5 w-1 bg-primary rounded-full" />
                                Thông tin khách hàng
                            </h3>
                            <div className="grid gap-4 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-dashed">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Họ và tên</p>
                                        <p className="font-bold text-slate-900 dark:text-slate-100">{booking.customerName}</p>
                                    </div>
                                </div>
                                <Separator className="bg-slate-200 dark:bg-slate-700" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Số điện thoại</p>
                                            <p className="text-sm font-semibold">{booking.customerPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500 font-medium">Email</p>
                                            <p className="text-sm font-semibold truncate">{booking.customerEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Booking Details */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="h-5 w-1 bg-primary rounded-full" />
                                Chi tiết lịch hẹn
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <CalendarIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Ngày thuê</p>
                                        <p className="font-bold">{format(new Date(booking.rentalDate), 'dd/MM/yyyy')}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Giờ đến</p>
                                        <p className="font-bold text-lg text-primary">{booking.arrivalTime}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Số người</p>
                                        <p className="font-bold">{booking.numberOfPeople} người</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Tạm tính</p>
                                        <p className="font-bold">{booking.totalPrice?.toLocaleString()} ¥</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Note */}
                        {booking.note && (
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <div className="h-5 w-1 bg-primary rounded-full" />
                                    Ghi chú từ khách
                                </h3>
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl flex gap-3">
                                    <FileText className="h-5 w-5 text-amber-600 shrink-0" />
                                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed italic">
                                        "{booking.note}"
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Items */}
                        {booking.items && booking.items.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <div className="h-5 w-1 bg-primary rounded-full" />
                                    Dịch vụ đã chọn
                                </h3>
                                <div className="space-y-2">
                                    {booking.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border rounded-lg group hover:border-primary transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                <span className="font-medium text-sm">{item.productName || item.itemName}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 font-bold">x{item.quantity}</span>
                                                <span className="text-sm font-bold">{item.price?.toLocaleString()} ¥</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Actions */}
                        <div className="pt-8 grid grid-cols-2 gap-4">
                            {booking.status === 'Confirmed' ? (
                                <Button 
                                    variant="outline" 
                                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12"
                                    onClick={() => handleUpdateStatus('Cancelled')}
                                >
                                    <XCircle className="h-4 w-4" />
                                    Hủy đơn này
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    className="gap-2 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 h-12"
                                    onClick={() => handleUpdateStatus('Confirmed')}
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Khôi phục đơn
                                </Button>
                            )}
                            <Button 
                                variant="destructive" 
                                className="gap-2 bg-red-600 hover:bg-red-700 h-12"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4" />
                                Xóa vĩnh viễn
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium justify-center pt-4">
                            <Info className="h-3 w-3" />
                            Đơn được tạo vào: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center text-muted-foreground">
                        Không tìm thấy dữ liệu đơn đặt lịch.
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
