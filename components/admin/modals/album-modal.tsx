'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

interface AlbumUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AlbumUploadModal({ isOpen, onClose, onSuccess }: AlbumUploadModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalPlanned = selectedFiles.length + files.length;
        if (totalPlanned > 20) {
            toast.error('Bạn chỉ có thể tải lên tối đa 20 ảnh mỗi lần');
            const remainingSlots = 20 - selectedFiles.length;
            if (remainingSlots <= 0) return;
            
            const limitedFiles = files.slice(0, remainingSlots);
            setSelectedFiles([...selectedFiles, ...limitedFiles]);
            
            const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews]);
        } else {
            const newFiles = [...selectedFiles, ...files];
            setSelectedFiles(newFiles);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews]);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // Revoke URL to avoid memory leak
        URL.revokeObjectURL(previews[index]);

        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Vui lòng chọn ít nhất một ảnh');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        setLoading(true);
        try {
            await api.post('/api/admin/album/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(`Đã tải lên ${selectedFiles.length} ảnh thành công`);
            onSuccess();
            handleClose();
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = typeof error.response?.data === 'string'
                ? error.response.data
                : error.response?.data?.message || 'Không thể tải ảnh lên';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        previews.forEach(url => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviews([]);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader>
                    <DialogTitle>Tải lên ảnh Album</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                        <Plus className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-medium">Click để chọn nhiều ảnh (Tối đa 20 ảnh/lần)</p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                    </div>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto p-1">
                            {previews.map((url, index) => (
                                <div key={url} className="relative aspect-square rounded-md overflow-hidden border group">
                                    <Image src={url} alt="Preview" fill className="object-cover" />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose} disabled={loading}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={loading || selectedFiles.length === 0}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Tải lên ({selectedFiles.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
