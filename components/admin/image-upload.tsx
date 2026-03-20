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
}

export function ImageUpload({ onImagesChange, existingImages = [], onDeleteExisting, deletedIds = [], onToggleDelete }: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        onImagesChange(newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);

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
                    <p className="text-sm text-neutral-500 mt-1">Hỗ trợ định dạng PNG, JPG, WEBP (Tối đa 5MB/ảnh)</p>
                </div>
                <input
                    type="file"
                    multiple
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
