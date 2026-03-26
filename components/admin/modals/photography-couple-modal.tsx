'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatNumberWithCommas, parseFormattedNumber } from '@/lib/utils';

import { Autocomplete } from '@/components/ui/autocomplete';

interface CoupleService {
    id?: string;
    rentalPricePerHour: number | string;
    clothingOfWomen: string | null;
    clothingOfMan: string | null;
}

interface CoupleModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: CoupleService | null;
    onSuccess: () => void;
}

export function CouplePhotographyModal({ isOpen, onClose, initialData, onSuccess }: CoupleModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        rentalPricePerHour: '',
        clothingOfWomen: null,
        clothingOfMan: null
    });

    const [outfitOptions, setOutfitOptions] = useState<any[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                rentalPricePerHour: formatNumberWithCommas(initialData.rentalPricePerHour),
            });
            // Fetch initial names for selected IDs if needed
            fetchInitialOutfitNames(initialData);
        } else {
            setFormData({ rentalPricePerHour: '', clothingOfWomen: null, clothingOfMan: null });
        }
    }, [initialData, isOpen]);

    const fetchInitialOutfitNames = async (data: CoupleService) => {
        try {
            const productsResponse = await api.get('/api/admin/catalog/products');
            const products = productsResponse.data;
            const options = products.map((p: any) => ({ label: p.name, value: p.id }));
            setOutfitOptions(options);
        } catch (error) {
            console.error('Failed to fetch initial products:', error);
        }
    };

    const handleOutfitSearch = async (query: string) => {
        try {
            const response = await api.get(`/api/admin/catalog/products?search=${query}`);
            return response.data.map((p: any) => ({
                label: p.name,
                value: p.id
            }));
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    };

    const handlePriceChange = (value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, rentalPricePerHour: formatNumberWithCommas(sanitized) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const submitData = {
            ...formData,
            rentalPricePerHour: parseFormattedNumber(formData.rentalPricePerHour.toString())
        };

        try {
            if (initialData?.id) {
                await api.put('/api/admin/photography/couple', submitData);
                toast.success('Đã cập nhật dịch vụ cặp đôi');
            } else {
                await api.post('/api/admin/photography/couple', submitData);
                toast.success('Đã thêm dịch vụ cặp đôi mới');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || 'Không thể lưu thông tin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Sửa dịch vụ cặp đôi' : 'Thêm dịch vụ cặp đôi'}</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin giá và trang phục đi kèm cho gói chụp ảnh cặp đôi.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4" autoComplete="off">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Giá thuê mỗi giờ (¥)</Label>
                        <Input
                            id="price"
                            type="text"
                            value={formData.rentalPricePerHour}
                            onChange={e => handlePriceChange(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Trang phục Nữ</Label>
                        <Autocomplete
                            value={formData.clothingOfWomen || undefined}
                            onValueChange={(val) => setFormData({ ...formData, clothingOfWomen: val })}
                            onSearch={handleOutfitSearch}
                            placeholder="Chọn trang phục nữ..."
                            initialOptions={outfitOptions}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Trang phục Nam</Label>
                        <Autocomplete
                            value={formData.clothingOfMan || undefined}
                            onValueChange={(val) => setFormData({ ...formData, clothingOfMan: val })}
                            onSearch={handleOutfitSearch}
                            placeholder="Chọn trang phục nam..."
                            initialOptions={outfitOptions}
                        />
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
