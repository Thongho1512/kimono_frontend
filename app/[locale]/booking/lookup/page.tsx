'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ManageBooking } from '@/components/booking/manage-booking';

export default function BookingLookupPage() {
    const t = useTranslations('booking');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contact.trim()) return;

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/bookings/lookup?contact=${encodeURIComponent(contact)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setBookings(data);
            setHasSearched(true);
            if (data.length === 0) {
                toast.error('Không tìm thấy đơn đặt lịch. Vui lòng kiểm tra lại thông tin.');
            }
        } catch (error) {
            console.error('Lookup error:', error);
            toast.error('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh]">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">Tra cứu đặt lịch</h1>
                    <p className="text-muted-foreground">Nhập Email hoặc Số điện thoại bạn đã dùng để đặt lịch để xem lại và quản lý thông tin.</p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-primary/10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input 
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Email hoặc Số điện thoại..." 
                            className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-primary"
                        />
                    </div>
                    <Button type="submit" size="lg" disabled={loading} className="h-12 px-8 gap-2 font-bold text-lg">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        Tra cứu
                    </Button>
                </form>

                {hasSearched && bookings.length > 0 && (
                    <div className="space-y-6 pt-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <div className="h-4 w-1 bg-primary rounded-full" />
                            Danh sách lịch đã đặt ({bookings.length})
                        </h2>
                        <div className="grid gap-6">
                            {bookings.map((booking) => (
                                <ManageBooking key={booking.id} booking={booking} onUpdate={() => handleSearch({ preventDefault: () => {} } as any)} />
                            ))}
                        </div>
                    </div>
                )}

                {hasSearched && bookings.length === 0 && !loading && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 p-8 rounded-2xl text-center space-y-3">
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-red-800 dark:text-red-400">Không tìm thấy thông tin</h3>
                        <p className="text-sm text-red-600 dark:text-red-300">
                            Vui lòng kiểm tra lại số điện thoại hoặc email. Hoặc bạn có thể liên hệ trực tiếp với chúng tôi qua số điện thoại 070-9150-0677 để được hỗ trợ.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
