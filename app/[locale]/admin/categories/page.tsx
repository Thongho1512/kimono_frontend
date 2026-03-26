'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { CategoryModal } from '@/components/admin/modals/category-modal';
import { useAdmin } from '@/lib/admin-context';
import { TableSkeleton } from '@/components/admin/skeleton-ui';

interface Category {
    id: string;
    name: string;
}

export default function CategoriesPage() {
    const { categories, isLoadingCategories, refreshCategories } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        if (categories.length === 0) {
            refreshCategories();
        }
    }, [categories.length, refreshCategories]);

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này? Các sản phẩm thuộc danh mục này cũng sẽ bị ảnh hưởng.')) return;
        try {
            await api.delete(`/api/admin/catalog/categories/${id}`);
            refreshCategories();
            toast.success('Đã xóa danh mục');
        } catch (error) {
            toast.error('Không thể xóa danh mục');
        }
    };

    if (isLoadingCategories && categories.length === 0) return (
        <TableSkeleton />
    );

    const columns = [
        { header: 'ID', accessorKey: 'id' as keyof Category },
        { header: 'Tên danh mục', accessorKey: 'name' as keyof Category },
        {
            header: 'Thao tác',
            accessorKey: (row: Category) => (
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý loại sản phẩm</h1>
                    <p className="text-muted-foreground mt-1">Quản lý các danh mục phân loại Kimono.</p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm loại
                </Button>
            </div>

            <DataTable
                data={categories}
                columns={columns}
                placeholder="Tìm kiếm danh mục..."
                searchKey="name"
            />

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedCategory}
                onSuccess={refreshCategories}
            />
        </div>
    );
}
