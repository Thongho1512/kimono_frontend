import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    onImagesChange: (files: File[]) => void;
    existingImages?: { id: string; url: string }[];
    onDeleteExisting?: (id: string) => void;
    deletedIds?: string[];
    onToggleDelete?: (id: string) => void;
    single?: boolean;
}

export function ImageUpload({ onImagesChange, existingImages = [], onDeleteExisting, deletedIds = [], onToggleDelete, single = false }: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        let newFiles: File[] = [];
        let newPreviews: string[] = [];

        if (single) {
            // Revoke old previews if any
            previews.forEach(url => URL.revokeObjectURL(url));
            newFiles = [files[0]];
            newPreviews = [URL.createObjectURL(files[0])];
        } else {
            newFiles = [...selectedFiles, ...files];
            newPreviews = [...previews, ...files.map(file => URL.createObjectURL(file))];
        }

        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
        onImagesChange(newFiles);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeNewImage = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // Clean up object URL
        URL.revokeObjectURL(previews[index]);

        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
        onImagesChange(newFiles);
    };

    if (single) {
        const currentImageUrl = previews[0] || (existingImages[0] && !deletedIds.includes(existingImages[0].id) ? existingImages[0].url : null);

        return (
            <div className="space-y-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*"
                />
                {currentImageUrl ? (
                    <div className="flex flex-col items-center gap-4">
                        <div 
                            className="relative group aspect-square w-full max-w-[280px] rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-neutral-100 cursor-pointer transition-all duration-500 hover:scale-[1.02]"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Image 
                                src={currentImageUrl} 
                                alt="Product" 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                <div className="bg-white/90 p-3 rounded-full flex items-center justify-center text-primary shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                    <Upload className="h-6 w-6" />
                                </div>
                            </div>
                            {previews[0] && (
                                <div className="absolute top-3 left-3 bg-green-500 text-[10px] text-white px-3 py-1 rounded-full font-bold shadow-lg uppercase tracking-wider">Mới</div>
                            )}
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all shadow-md active:scale-95"
                        >
                            <Upload className="h-4 w-4" />
                            Thay đổi hình ảnh
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-neutral-300 rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 hover:scale-[1.01] transition-all duration-300 group"
                    >
                        <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-neutral-700">Tải ảnh sản phẩm</p>
                            <p className="text-xs text-neutral-500 mt-2 max-w-[200px]">
                                PNG, JPG, WEBP cao nhất 50MB. Hệ thống sẽ tự động tối ưu dung lượng.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-neutral-50 transition-all"
            >
                <div className="bg-primary/10 p-3 rounded-full">
                    <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                    <p className="font-medium">Nhấn để tải ảnh hoặc kéo thả vào đây</p>
                    <p className="text-sm text-neutral-500 mt-1">Hỗ trợ định dạng PNG, JPG, WEBP (Tối đa 50MB/ảnh - Hệ thống sẽ tự động tối ưu)</p>
                </div>
                <input
                    type="file"
                    multiple={!single}
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*"
                />
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((img) => {
                    const isDeleted = deletedIds.includes(img.id);
                    return (
                        <div
                            key={img.id}
                            className={cn(
                                "relative aspect-square rounded-md overflow-hidden border group cursor-pointer transition-all duration-200",
                                isDeleted && "ring-2 ring-destructive opacity-50 grayscale-[0.5]"
                            )}
                            onClick={() => onToggleDelete?.(img.id)}
                        >
                            <Image
                                src={img.url}
                                alt="Product"
                                fill
                                className={cn(
                                    "object-cover transition-all",
                                    isDeleted && "blur-[2px]"
                                )}
                            />
                            {isDeleted && (
                                <div className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full shadow-lg">
                                    <X className="h-3 w-3" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    );
                })}

                {/* New Image Previews */}
                {previews.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-md overflow-hidden border-2 border-primary/20 group">
                        <Image src={url} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="bg-destructive text-destructive-foreground p-2 rounded-full hover:scale-110 transition-transform"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-primary text-[10px] text-white py-0.5 text-center font-medium">MỚI</div>
                    </div>
                ))}
            </div>

            {(previews.length === 0 && existingImages.length === 0) && (
                <div className="flex flex-col items-center justify-center py-10 bg-neutral-50 rounded-lg border border-neutral-100 italic text-neutral-400">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                    Chưa có hình ảnh nào được tải lên
                </div>
            )}
        </div>
    );
}
