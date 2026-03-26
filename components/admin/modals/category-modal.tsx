'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Category {
    id?: string;
    name: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Category | null;
    onSuccess: () => void;
}

export function CategoryModal({ isOpen, onClose, initialData, onSuccess }: CategoryModalProps) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        } else {
            setName('');
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Tên danh mục không được để trống');
            return;
        }

        setLoading(true);
        try {
            if (initialData?.id) {
                await api.put('/api/admin/catalog/categories', { id: initialData.id, name, slug: '' });
                toast.success('Đã cập nhật danh mục');
            } else {
                await api.post('/api/admin/catalog/categories', { name, slug: '' });
                toast.success('Đã thêm danh mục mới');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Save category error detailed:', error.response?.data);
            let errorMessage = 'Không thể lưu danh mục';
            
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.errors) {
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
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4" autoComplete="off">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên danh mục <span className="text-destructive">*</span></Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Kimono Nữ, Kimono Nam..." />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Hủy</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
