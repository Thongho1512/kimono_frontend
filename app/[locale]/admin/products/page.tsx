'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Edit, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ProductModal } from '@/components/admin/modals/product-modal';
import Image from 'next/image';

interface Product {
    id: string;
    categoryId: string;
    name: string;
    rentalPricePerDay: number;
    rentalPriceMin: number;
    rentalPriceMax: number;
    priceType: string;
    images: { id: string; url: string }[];
}

interface Category {
    id: string;
    name: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/api/admin/catalog/products'),
                api.get('/api/admin/catalog/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Failed to fetch', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            await api.delete(`/api/admin/catalog/products/${id}`);
            fetchData();
            toast.success('Đã xóa sản phẩm');
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    const columns = [
        {
            header: 'Ảnh',
            accessorKey: (row: Product) => row.images && row.images.length > 0 ? (
                <div className="relative h-12 w-12 rounded border overflow-hidden">
                    <Image src={row.images[0].url} alt={row.name} fill className="object-cover" />
                    {row.images.length > 1 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] text-white">
                            +{row.images.length - 1}
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-12 w-12 rounded border bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <ImageIcon className="h-6 w-6" />
                </div>
            )
        },
        { header: 'Tên sản phẩm', accessorKey: 'name' as keyof Product },
        {
            header: 'Danh mục',
            accessorKey: (row: Product) => categories.find(c => c.id === row.categoryId)?.name || 'N/A'
        },
        {
            header: 'Giá thuê (Ngày)',
            accessorKey: (row: Product) => {
                if (row.priceType === 'Khoảng') {
                    return `¥ ${row.rentalPriceMin.toLocaleString()} - ${row.rentalPriceMax.toLocaleString()}`;
                }
                return `¥ ${row.rentalPricePerDay.toLocaleString()}`;
            }
        },
        {
            header: 'Thao tác',
            accessorKey: (row: Product) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(row.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
                    <p className="text-muted-foreground mt-1">Danh sách Kimono hiện có trong cửa hàng.</p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
                </Button>
            </div>

            <DataTable
                data={products}
                columns={columns}
                placeholder="Tìm kiếm sản phẩm..."
                searchKey="name"
            />

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedProduct}
                categories={categories}
                onSuccess={fetchData}
            />
        </div>
    );
}
