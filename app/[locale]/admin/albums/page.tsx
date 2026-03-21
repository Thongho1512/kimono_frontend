'use client';
export const runtime = 'edge';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, X, CheckCircle2, Eye, MousePointer2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlbumUploadModal } from '@/components/admin/modals/album-modal';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AlbumImage {
    id: string;
    url: string;
}

export default function AlbumsPage() {
    const [images, setImages] = useState<AlbumImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [activeImage, setActiveImage] = useState<AlbumImage | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/album');
            setImages(res.data);
            setSelectedIds([]);
        } catch (error) {
            toast.error('Không thể tải ảnh album');
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (img: AlbumImage) => {
        if (isSelectMode) {
            setSelectedIds(prev =>
                prev.includes(img.id) ? prev.filter(i => i !== img.id) : [...prev, img.id]
            );
        } else {
            setActiveImage(img);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === images.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(images.map(img => img.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} ảnh đã chọn?`)) return;

        try {
            await api.post('/api/admin/album/delete-multiple', { ids: selectedIds });
            toast.success('Đã xóa các ảnh thành công');
            fetchData();
            setIsSelectMode(false);
        } catch (error) {
            toast.error('Lỗi khi xóa ảnh');
        }
    };

    const exitSelectMode = () => {
        setIsSelectMode(false);
        setSelectedIds([]);
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Album Ảnh</h1>
                    <p className="text-muted-foreground">Tải lên và quản lý hình ảnh trong album của cửa hàng.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {isSelectMode ? (
                        <>
                            <Button variant="outline" size="sm" onClick={handleSelectAll}>
                                {selectedIds.length === images.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={selectedIds.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa ({selectedIds.length})
                            </Button>
                            <Button variant="ghost" size="sm" onClick={exitSelectMode}>
                                <X className="mr-2 h-4 w-4" /> Thoát
                            </Button>
                        </>
                    ) : (
                        <>
                            {images.length > 0 && (
                                <Button variant="outline" size="sm" onClick={() => setIsSelectMode(true)}>
                                    <MousePointer2 className="mr-2 h-4 w-4" /> Chế độ xóa
                                </Button>
                            )}
                            <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Tải lên ảnh
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {images.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="bg-muted p-4 rounded-full">
                            <Plus className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Chưa có ảnh nào</h3>
                            <p className="text-sm text-muted-foreground">Hãy tải lên những tấm hình đẹp nhất cho album của bạn.</p>
                        </div>
                        <Button onClick={() => setIsUploadModalOpen(true)}>
                            Tải lên ngay
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className={cn(
                                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm group",
                                selectedIds.includes(img.id)
                                    ? "border-destructive ring-4 ring-destructive/20"
                                    : "border-transparent hover:border-primary/50"
                            )}
                            onClick={() => handleImageClick(img)}
                        >
                            <Image
                                src={img.url}
                                alt="Album photo"
                                fill
                                className={cn(
                                    "object-cover transition-transform duration-500",
                                    selectedIds.includes(img.id) ? "scale-90" : "group-hover:scale-110",
                                    isSelectMode && !selectedIds.includes(img.id) && "hover:brightness-75"
                                )}
                            />

                            {/* View Overlay */}
                            {!isSelectMode && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white animate-in zoom-in-75">
                                        <Eye className="h-6 w-6" />
                                    </div>
                                </div>
                            )}

                            {/* Selection Overlays */}
                            {isSelectMode && (
                                <div className={cn(
                                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                                    selectedIds.includes(img.id) ? "bg-destructive/40" : "bg-black/0 group-hover:bg-black/20"
                                )}>
                                    {selectedIds.includes(img.id) ? (
                                        <CheckCircle2 className="h-10 w-10 text-white animate-in zoom-in" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Dialog */}
            <Dialog open={!!activeImage} onOpenChange={() => setActiveImage(null)}>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 border-none bg-transparent shadow-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Xem ảnh album</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-[85vh] flex items-center justify-center">
                        {activeImage && (
                            <div className="relative w-full h-full">
                                <Image
                                    src={activeImage.url}
                                    alt="Album Image Large"
                                    fill
                                    className="object-contain animate-in fade-in zoom-in duration-300"
                                    priority
                                />
                                <button
                                    onClick={() => setActiveImage(null)}
                                    className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 backdrop-blur-md transition-colors border border-white/20"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <AlbumUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}
