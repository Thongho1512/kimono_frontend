'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { HairStyleModal } from '@/components/admin/modals/hair-style-modal';
import Image from 'next/image';

interface HairStyle {
    id: string;
    name: string;
    url: string;
    description: string;
}

export default function HairStylesPage() {
    const [data, setData] = useState<HairStyle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<HairStyle | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/hair-styles');
            setData(res.data);
        } catch (error) {
            toast.error('Không thể tải danh sách mẫu tóc');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa mẫu tóc này?')) return;
        try {
            await api.delete(`/api/admin/hair-styles/${id}`);
            fetchData();
            toast.success('Đã xóa');
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    const columns = [
        {
            header: 'Hình ảnh',
            accessorKey: (row: HairStyle) => (
                <div className="relative w-12 h-12 rounded overflow-hidden">
                    {row.url ? (
                        <Image src={row.url} alt={row.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">No Image</div>
                    )}
                </div>
            )
        },
        { header: 'Tên mẫu tóc', accessorKey: 'name' as keyof HairStyle },
        { header: 'Mô tả', accessorKey: 'description' as keyof HairStyle },
        {
            header: 'Thao tác',
            accessorKey: (row: HairStyle) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(row); setIsModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(row.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Mẫu tóc</h1>
                <p className="text-muted-foreground">Danh sách các kiểu tóc phục vụ khách hàng thuê Kimono.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Danh sách mẫu tóc</CardTitle>
                        <CardDescription>Thêm, sửa và quản lý hình ảnh các mẫu tóc của cửa hàng.</CardDescription>
                    </div>
                    <Button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Thêm mẫu mới
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable data={data} columns={columns} searchKey="name" placeholder="Tìm kiếm mẫu tóc..." />
                </CardContent>
            </Card>

            <HairStyleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedItem}
                onSuccess={fetchData}
            />
        </div>
    );
}
