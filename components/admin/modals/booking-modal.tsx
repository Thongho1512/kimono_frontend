'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, User, Phone, Calendar, CreditCard, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Booking {
    id: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    status: string;
    totalPrice: number;
    email?: string;
    note?: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
    onSuccess: () => void;
}

export function BookingModal({ isOpen, onClose, booking }: BookingModalProps) {
    if (!booking) return null;

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Đã xác nhận</Badge>;
            case 'pending': return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Chờ xử lý</Badge>;
            case 'cancelled': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Đã hủy</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chi tiết đơn đặt lịch</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">ID: {booking.id}</span>
                        {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid gap-4">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Khách hàng</p>
                                <p className="font-medium text-lg">{booking.customerName}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Số điện thoại</p>
                                <p className="font-medium">{booking.customerPhone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Ngày đặt</p>
                                <p className="font-medium">
                                    {format(new Date(booking.bookingDate), 'PPPP', { locale: vi })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Tổng thanh toán</p>
                                <p className="font-bold text-xl text-primary">{booking.totalPrice.toLocaleString()} JPY</p>
                            </div>
                        </div>

                        {booking.note && (
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Ghi chú</p>
                                    <p className="text-sm bg-muted p-2 rounded-md italic mt-1">{booking.note}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
