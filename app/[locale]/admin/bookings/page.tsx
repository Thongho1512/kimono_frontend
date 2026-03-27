'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
    Calendar as CalendarIcon, 
    Filter, 
    Search, 
    MoreHorizontal, 
    CheckCircle2, 
    XCircle, 
    Clock,
    User,
    Phone,
    Mail,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BookingDetails } from '@/components/admin/booking-details';
import { CreateBookingDialog } from '@/components/admin/create-booking-dialog';
import * as signalR from '@microsoft/signalr';

interface Booking {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    rentalDate: string;
    arrivalTime: string;
    numberOfPeople: number;
    status: 'Confirmed' | 'Cancelled';
    note?: string;
    totalPrice: number;
    createdAt: string;
    items: any[];
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const dateStr = date ? format(date, 'yyyy-MM-dd') : '';
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/bookings?date=${dateStr}`);
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data = await response.json();
            
            // Sorting by arrival time (ascending)
            const sortedData = data.sort((a: Booking, b: Booking) => {
                return a.arrivalTime.localeCompare(b.arrivalTime);
            });
            
            setBookings(sortedData);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Không thể tải danh sách đặt lịch');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        // SignalR Connection
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/booking`)
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log('SignalR Connected');
                connection.on('ReceiveBookingUpdate', () => {
                    console.log('Booking update received via SignalR');
                    fetchBookings();
                });
            })
            .catch(err => console.error('SignalR Connection Error: ', err));

        return () => {
            connection.stop();
        };
    }, [date]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/bookings/${id}/status?status=${status}`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('Failed to update status');
            toast.success('Cập nhật trạng thái thành công');
            fetchBookings();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đơn đặt lịch này?')) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/bookings/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete booking');
            toast.success('Xóa đơn đặt lịch thành công');
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Không thể xóa đơn đặt lịch');
        }
    };

    const filteredBookings = bookings.filter(booking => 
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerPhone.includes(searchQuery) ||
        booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý đặt lịch</h1>
                    <p className="text-muted-foreground">Theo dõi và quản lý các yêu cầu đặt lịch từ khách hàng.</p>
                </div>
                <Button className="gap-2 shrink-0" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Tạo đơn mới
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Tìm tên, SĐT, email..." 
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start text-left font-normal w-full sm:w-auto",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    
                    <Button variant="ghost" size="icon" onClick={() => setDate(undefined)} title="Xóa lọc ngày">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="text-sm font-medium text-slate-500">
                    Tổng số: <span className="text-slate-900 dark:text-slate-100">{filteredBookings.length}</span> đơn
                </div>
            </div>

            <div className="rounded-xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableHead className="w-[100px]">Giờ đến</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead className="hidden md:table-cell">Liên hệ</TableHead>
                            <TableHead className="text-center">Số người</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Không tìm thấy đơn đặt lịch nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer group" onClick={() => {
                                    setSelectedBookingId(booking.id);
                                    setIsDetailsOpen(true);
                                }}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-semibold text-primary">
                                            <Clock className="h-3 w-3" />
                                            {booking.arrivalTime}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{booking.customerName}</span>
                                            <span className="text-xs text-muted-foreground md:hidden">{booking.customerPhone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-col text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {booking.customerPhone}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {booking.customerEmail}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {booking.numberOfPeople}
                                    </TableCell>
                                    <TableCell>
                                        {booking.status === 'Cancelled' ? (
                                            <Badge variant="destructive" className="gap-1 bg-red-100 text-red-700 hover:bg-red-200 border-none">
                                                <XCircle className="h-3 w-3" />
                                                Đã hủy
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="gap-1 bg-green-100 text-green-700 hover:bg-green-200 border-none">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Đã xác nhận
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedBookingId(booking.id);
                                                    setIsDetailsOpen(true);
                                                }}>
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateStatus(booking.id, booking.status === 'Confirmed' ? 'Cancelled' : 'Confirmed');
                                                }}>
                                                    {booking.status === 'Confirmed' ? 'Hủy lịch' : 'Khôi phục lịch'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-red-600 focus:text-red-600" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(booking.id);
                                                    }}
                                                >
                                                    Xóa đơn
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedBookingId && (
                <BookingDetails 
                    id={selectedBookingId} 
                    isOpen={isDetailsOpen} 
                    onClose={() => {
                        setIsDetailsOpen(false);
                        setSelectedBookingId(null);
                    }}
                    onUpdate={fetchBookings}
                />
            )}

            <CreateBookingDialog 
                isOpen={isCreateOpen} 
                onClose={() => setIsCreateOpen(false)} 
                onSuccess={fetchBookings} 
            />
        </div>
    );
}
