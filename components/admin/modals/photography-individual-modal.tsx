'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatNumberWithCommas, parseFormattedNumber } from '@/lib/utils';

interface IndividualService {
    id?: string;
    name: string;
    quantity: number | string;
    firstHour: number | string;
    secondHour: number | string;
}

interface IndividualModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: IndividualService | null;
    onSuccess: () => void;
}

export function IndividualPhotographyModal({ isOpen, onClose, initialData, onSuccess }: IndividualModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        quantity: '',
        firstHour: '',
        secondHour: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                quantity: formatNumberWithCommas(initialData.quantity),
                firstHour: formatNumberWithCommas(initialData.firstHour),
                secondHour: formatNumberWithCommas(initialData.secondHour),
            });
        } else {
            setFormData({ name: '', quantity: '', firstHour: '', secondHour: '' });
        }
    }, [initialData, isOpen]);

    const handleNumberChange = (field: string, value: string) => {
        // Only allow numbers (commas will be added by formatter)
        const sanitized = value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, [field]: formatNumberWithCommas(sanitized) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Tên dịch vụ không được để trống');
            return;
        }

        setLoading(true);
        // Convert formatted strings back to numbers for API
        const submitData = {
            ...formData,
            quantity: parseFormattedNumber(formData.quantity.toString()),
            firstHour: parseFormattedNumber(formData.firstHour.toString()),
            secondHour: parseFormattedNumber(formData.secondHour.toString()),
        };

        try {
            if (initialData?.id) {
                await api.put('/api/admin/photography/individual', submitData);
                toast.success('Đã cập nhật dịch vụ');
            } else {
                await api.post('/api/admin/photography/individual', submitData);
                toast.success('Đã thêm dịch vụ mới');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Save error:', error);
            const errorMessage = typeof error.response?.data === 'string'
                ? error.response.data
                : error.response?.data?.message || 'Không thể lưu thông tin';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Sửa dịch vụ cá nhân' : 'Thêm dịch vụ cá nhân'}</DialogTitle>
                    <DialogDescription>
                        Nhập các thông tin chi tiết về gói chụp ảnh dành cho cá nhân.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4" autoComplete="off">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên dịch vụ <span className="text-destructive">*</span></Label>
                        <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Gói chụp cá nhân" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Số lượng người</Label>
                        <Input
                            id="quantity"
                            type="text"
                            value={formData.quantity}
                            onChange={e => handleNumberChange('quantity', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstHour">Giờ đầu (¥)</Label>
                            <Input
                                id="firstHour"
                                type="text"
                                value={formData.firstHour}
                                onChange={e => handleNumberChange('firstHour', e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="secondHour">Giờ thứ 2 (¥)</Label>
                            <Input
                                id="secondHour"
                                type="text"
                                value={formData.secondHour}
                                onChange={e => handleNumberChange('secondHour', e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Hủy</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    );
}
