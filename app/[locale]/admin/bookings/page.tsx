'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BookingModal } from '@/components/admin/modals/booking-modal';

interface Booking {
    id: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    status: string;
    totalPrice: number;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/bookings');
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Đã xác nhận</Badge>;
            case 'pending': return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Chờ xử lý</Badge>;
            case 'cancelled': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Đã hủy</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;

    const columns = [
        { header: 'Khách hàng', accessorKey: 'customerName' as keyof Booking },
        { header: 'Điện thoại', accessorKey: 'customerPhone' as keyof Booking },
        {
            header: 'Ngày đặt',
            accessorKey: (row: Booking) => new Date(row.bookingDate).toLocaleDateString('vi-VN')
        },
        {
            header: 'Tổng tiền',
            accessorKey: (row: Booking) => `${row.totalPrice.toLocaleString()} JPY`
        },
        {
            header: 'Trạng thái',
            accessorKey: (row: Booking) => getStatusBadge(row.status)
        },
        {
            header: 'Thao tác',
            accessorKey: (row: Booking) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(row)} title="Xem chi tiết"><Eye className="h-4 w-4" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Quản lý Đặt lịch (Bookings)</h1>

            <DataTable
                data={bookings}
                columns={columns}
                placeholder="Tìm khách hàng..."
                searchKey="customerName"
            />

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                booking={selectedBooking}
                onSuccess={fetchData}
            />
        </div>
    );
}
