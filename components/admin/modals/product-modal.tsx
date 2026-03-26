'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ImageUpload } from '../image-upload';
import { formatNumberWithCommas, parseFormattedNumber } from '@/lib/utils';

interface Product {
    id: string;
    categoryId: string;
    name: string;
    rentalPricePerDay: number | string;
    rentalPriceMin: number | string;
    rentalPriceMax: number | string;
    priceType: string;
    images: { id: string; url: string }[];
}

interface Category {
    id: string;
    name: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Product | null;
    categories: Category[];
    onSuccess: () => void;
}

export function ProductModal({ isOpen, onClose, initialData, categories, onSuccess }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        categoryId: '',
        rentalPricePerDay: '',
        rentalPriceMin: '',
        rentalPriceMax: '',
        priceType: 'Cố định'
    });
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                categoryId: initialData.categoryId,
                rentalPricePerDay: formatNumberWithCommas(initialData.rentalPricePerDay),
                rentalPriceMin: formatNumberWithCommas(initialData.rentalPriceMin),
                rentalPriceMax: formatNumberWithCommas(initialData.rentalPriceMax),
                priceType: initialData.priceType
            });
            setDeletedImageIds([]);
        } else {
            setFormData({
                name: '',
                categoryId: categories[0]?.id || '',
                rentalPricePerDay: '',
                rentalPriceMin: '',
                rentalPriceMax: '',
                priceType: 'Cố định'
            });
        }
        setNewFiles([]);
    }, [initialData, isOpen, categories]);

    const handlePriceChange = (field: string, value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, [field]: formatNumberWithCommas(sanitized) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.categoryId) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        const submitData = new FormData();
        if (initialData?.id) submitData.append('Id', initialData.id);
        submitData.append('Name', formData.name);
        submitData.append('Slug', ''); // No manual slug
        submitData.append('CategoryId', formData.categoryId);

        // Convert formatted strings back to numbers for API
        const pricePerDay = parseFormattedNumber(formData.rentalPricePerDay.toString());
        const priceMin = parseFormattedNumber(formData.rentalPriceMin.toString());
        const priceMax = parseFormattedNumber(formData.rentalPriceMax.toString());

        submitData.append('RentalPricePerDay', pricePerDay.toString());
        submitData.append('RentalPriceMin', priceMin.toString());
        submitData.append('RentalPriceMax', priceMax.toString());
        submitData.append('PriceType', formData.priceType);

        newFiles.forEach(file => submitData.append('NewImages', file));
        deletedImageIds.forEach(id => submitData.append('DeletedImageIds', id));

        try {
            if (initialData?.id) {
                await api.put('/api/admin/catalog/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await api.post('/api/admin/catalog/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Thêm sản phẩm thành công');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Save error detailed:', error.response?.data);
            let errorMessage = 'Có lỗi xảy ra khi lưu sản phẩm';
            
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.errors) {
                    // Handle ASP.NET Core Validation Errors
                    const validationErrors = error.response.data.errors;
                    const messages = Object.keys(validationErrors)
                        .map(key => `${key}: ${validationErrors[key].join(', ')}`);
                    errorMessage = messages.join('\n') || error.response.data.title || errorMessage;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-3xl max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {initialData ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4" autoComplete="off">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="prod-name">Tên sản phẩm <span className="text-destructive">*</span></Label>
                            <Input id="prod-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Kimono Lace Cao Cấp" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Danh mục <span className="text-destructive">*</span></Label>
                            <Select value={formData.categoryId} onValueChange={val => setFormData({ ...formData, categoryId: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-neutral-50/50 p-4 rounded-lg border space-y-4">
                        <div className="grid gap-2 max-w-[240px]">
                            <Label htmlFor="priceType" className="font-semibold text-primary">Cấu hình loại giá <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.priceType}
                                onValueChange={val => {
                                    setFormData({
                                        ...formData,
                                        priceType: val,
                                        rentalPricePerDay: val === 'Cố định' ? formData.rentalPricePerDay : formatNumberWithCommas(0),
                                        rentalPriceMin: val === 'Khoảng' ? formData.rentalPriceMin : formatNumberWithCommas(0),
                                        rentalPriceMax: val === 'Khoảng' ? formData.rentalPriceMax : formatNumberWithCommas(0),
                                    });
                                }}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cố định">Giá cố định</SelectItem>
                                    <SelectItem value="Khoảng">Giá theo khoảng (Min - Max)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.priceType === 'Cố định' ? (
                            <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                                <Label htmlFor="priceDay">Giá thuê cố định (VNĐ) <span className="text-destructive">*</span></Label>
                                <Input
                                    id="priceDay"
                                    type="text"
                                    value={formData.rentalPricePerDay}
                                    onChange={e => handlePriceChange('rentalPricePerDay', e.target.value)}
                                    className="max-w-[320px]"
                                    placeholder="0"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                                <div className="grid gap-2">
                                    <Label htmlFor="priceMin">Giá thấp nhất (VNĐ) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="priceMin"
                                        type="text"
                                        value={formData.rentalPriceMin}
                                        onChange={e => handlePriceChange('rentalPriceMin', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="priceMax">Giá cao nhất (VNĐ) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="priceMax"
                                        type="text"
                                        value={formData.rentalPriceMax}
                                        onChange={e => handlePriceChange('rentalPriceMax', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-2">
                        <Label className="font-semibold">Hình ảnh sản phẩm</Label>
                        <ImageUpload
                            existingImages={initialData?.images || []}
                            deletedIds={deletedImageIds}
                            onToggleDelete={(id) => {
                                setDeletedImageIds(prev =>
                                    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                                );
                            }}
                            onImagesChange={(files: File[]) => setNewFiles(files)}
                        />
                    </div>

                    <DialogFooter className="bg-neutral-50 -mx-6 -mb-6 p-6">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Hủy</Button>
                        <Button type="submit" disabled={loading} className="min-w-[120px]">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
