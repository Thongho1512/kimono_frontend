'use client';

import { useState, useEffect } from 'react';
import { format, isValid } from 'date-fns';
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import api from '@/lib/api';
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

    const safeFormat = (dateStr: string | undefined | null, formatStr: string) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return isValid(d) ? format(d, formatStr) : 'N/A';
    };

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/Admin/bookings/${id}`);
            setBooking(response.data);
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

    const handleUpdateStatus = async (statusStr: string) => {
        try {
            let statusInt = 0; // Confirmed
            if (statusStr === 'Cancelled') statusInt = 1;
            if (statusStr === 'Completed') statusInt = 2;
            
            await api.put(`/api/Admin/bookings/${id}/status?status=${statusInt}`);
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
            await api.delete(`/api/Admin/bookings/${id}`);
            toast.success('Xóa thành công');
            onClose();
            onUpdate();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể xóa đơn đặt lịch');
        }
    };

    const getNormalizedStatus = (status: any) => {
        if (status === 0 || status === 'Confirmed') return 'Confirmed';
        if (status === 1 || status === 'Cancelled') return 'Cancelled';
        if (status === 2 || status === 'Completed') return 'Completed';
        return 'Confirmed'; // Fallback
    };
    const currentStatus = getNormalizedStatus(booking?.status);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-0 border-none shadow-2xl">
                <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b p-6">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Chi tiết đơn đặt lịch
                        </DialogTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogHeader>
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
                                {currentStatus === 'Cancelled' && (
                                    <Badge variant="destructive" className="gap-1.5 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-100 border-none font-semibold">
                                        <XCircle className="h-4 w-4" />
                                        ĐÃ HỦY
                                    </Badge>
                                )}
                                {currentStatus === 'Completed' && (
                                    <Badge variant="default" className="gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-semibold shadow-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                        HOÀN THÀNH
                                    </Badge>
                                )}
                                {currentStatus === 'Confirmed' && (
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
                                        <p className="font-bold">{safeFormat(booking.bookingDate, 'dd/MM/yyyy')}</p>
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
                                <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center gap-2 col-span-2">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="w-full">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Thành phần đoàn</p>
                                        <div className="text-sm font-bold flex flex-wrap justify-center gap-3 mt-2">
                                            <span className="bg-slate-50 px-3 py-1 rounded-full border">👱‍♂️ Nam lớn: {booking.adultMale}</span>
                                            <span className="bg-slate-50 px-3 py-1 rounded-full border">👩 Nữ lớn: {booking.adultFemale}</span>
                                            <span className="bg-slate-50 px-3 py-1 rounded-full border">👦 Bé trai: {booking.childMale}</span>
                                            <span className="bg-slate-50 px-3 py-1 rounded-full border">👧 Bé gái: {booking.childFemale}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-3 font-medium">Tổng cộng: {booking.numberOfPeople} người</p>
                                        
                                        {(booking.childMale > 0 || booking.childFemale > 0) && (
                                            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium">
                                                🍼 Tuổi các bé: {booking.childAges ? booking.childAges : "Khách không ghi số tuổi"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center gap-2 col-span-2">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Dự kiến thanh toán</p>
                                        <p className="text-sm font-bold mt-1 text-slate-700">Thực tế sẽ tính tiền trên đồ đã chọn ở tiệm</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Extra Services & Note Section */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="h-5 w-1 bg-primary rounded-full" />
                                Dịch vụ bổ sung & Ghi chú
                            </h3>
                            <div className="space-y-4 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-dashed">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-1">Dịch vụ đi kèm</p>
                                    <p className="font-bold text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                                        {booking.extraServices ? booking.extraServices : "Không có"}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-1">Ghi chú từ khách</p>
                                    <p className="text-sm italic p-2 bg-white dark:bg-slate-900 rounded border text-slate-700 dark:text-slate-300">
                                        {booking.note ? `"${booking.note}"` : "Không có ghi chú"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Items Section */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="h-5 w-1 bg-primary rounded-full" />
                                Danh sách sản phẩm Kimono đã chọn
                            </h3>
                            <div className="space-y-2">
                                {booking.items && booking.items.length > 0 ? (
                                    booking.items.map((item: any, idx: number) => (
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
                                    ))
                                ) : (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border text-center text-sm text-slate-500 italic">
                                        Khách hàng không chọn trước bất kỳ sản phẩm Kimono nào trên web.
                                    </div>
                                )}
                            </div>
                        </section>



                        {/* Actions Area */}
                        <div className="pt-10 space-y-4">
                            {currentStatus === 'Confirmed' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Button 
                                        variant="default" 
                                        className="h-14 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base gap-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 border-none"
                                        onClick={() => handleUpdateStatus('Completed')}
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                        Hoàn thành đơn
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="h-14 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-medium text-base gap-2 rounded-xl transition-all duration-200 active:scale-95"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-400 group-hover:text-red-600" />
                                        Xóa vĩnh viễn
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    variant="destructive" 
                                    className="h-14 w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base gap-2.5 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-95"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-5 w-5" />
                                    Xóa đơn này vĩnh viễn
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium justify-center pt-4">
                            <Info className="h-3 w-3" />
                            Đơn được tạo vào: {safeFormat(booking.createdAt, 'dd/MM/yyyy HH:mm')}
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center text-muted-foreground">
                        Không tìm thấy dữ liệu đơn đặt lịch.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
