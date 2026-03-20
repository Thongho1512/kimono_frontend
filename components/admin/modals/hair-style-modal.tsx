'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Camera, X, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HairStyle {
    id?: string;
    name: string;
    url?: string;
    description: string;
}

interface HairStyleModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: HairStyle | null;
    onSuccess: () => void;
}

export function HairStyleModal({ isOpen, onClose, initialData, onSuccess }: HairStyleModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<HairStyle>({
        name: '',
        description: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isImageDeleted, setIsImageDeleted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setPreview(initialData.url || null);
        } else {
            setFormData({ name: '', description: '' });
            setPreview(null);
        }
        setSelectedFile(null);
        setIsImageDeleted(false);
    }, [initialData, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setIsImageDeleted(false);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const toggleDeleteImage = () => {
        if (selectedFile) {
            // If it's a new file, just clear it and revert to initial
            setSelectedFile(null);
            setPreview(initialData?.url || null);
        } else if (initialData?.url) {
            setIsImageDeleted(!isImageDeleted);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Tên mẫu tóc không được để trống');
            return;
        }

        const submitData = new FormData();
        if (initialData?.id) submitData.append('Id', initialData.id);
        submitData.append('Name', formData.name);
        submitData.append('Description', formData.description || '');

        if (selectedFile) {
            submitData.append('Image', selectedFile);
        }
        if (isImageDeleted) {
            submitData.append('DeleteImage', 'true');
        }

        setLoading(true);
        try {
            if (initialData?.id) {
                await api.put('/api/admin/hair-styles', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Đã cập nhật mẫu tóc');
            } else {
                await api.post('/api/admin/hair-styles', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Đã thêm mẫu tóc mới');
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
                    <DialogTitle>{initialData ? 'Sửa mẫu tóc' : 'Thêm mẫu tóc mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4" autoComplete="off">
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className={cn(
                                "relative w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-muted transition-all cursor-pointer group",
                                isImageDeleted && "ring-2 ring-destructive opacity-80"
                            )}
                            onClick={toggleDeleteImage}
                            title={isImageDeleted ? "Nhấn để hoàn tác xóa" : "Nhấn để đánh dấu xóa"}
                        >
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className={cn(
                                        "object-cover transition-all",
                                        isImageDeleted && "blur-[4px] grayscale"
                                    )}
                                />
                            ) : (
                                <Camera className="h-12 w-12 text-muted-foreground" />
                            )}

                            {isImageDeleted && !selectedFile && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 z-10 text-destructive font-bold text-sm">
                                    <X className="h-10 w-10 mb-1" />
                                    <span>ĐÃ ĐÁNH DẤU XÓA</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-xs pointer-events-none">
                                {isImageDeleted ? "Nhấn để hoàn tác xóa" : (preview ? "Nhấn để đánh dấu xóa" : "Chưa có ảnh")}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={triggerFileSelect}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {preview ? 'Thay thế ảnh' : 'Tải lên ảnh'}
                            </Button>

                            {preview && !selectedFile && (
                                <Button
                                    type="button"
                                    variant={isImageDeleted ? "default" : "destructive"}
                                    size="sm"
                                    onClick={toggleDeleteImage}
                                >
                                    {isImageDeleted ? "Hoàn tác xóa" : "Xóa ảnh"}
                                </Button>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <p className="text-[10px] text-muted-foreground text-center">
                            Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa: 5MB.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên mẫu tóc <span className="text-destructive">*</span></Label>
                        <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Búi tóc kiểu Nhật" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả ngắn về kiểu tóc..." />
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
