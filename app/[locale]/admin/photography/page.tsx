'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Trash2, Edit, Camera, Users } from 'lucide-react';
import { toast } from 'sonner';
import { IndividualPhotographyModal } from '@/components/admin/modals/photography-individual-modal';
import { CouplePhotographyModal } from '@/components/admin/modals/photography-couple-modal';

interface IndividualService {
    id: string;
    name: string;
    quantity: number;
    firstHour: number;
    secondHour: number;
}

interface CoupleService {
    id: string;
    rentalPricePerHour: number;
    clothingOfWomen: string;
    clothingOfMan: string;
}

export default function PhotographyPage() {
    const [individuals, setIndividuals] = useState<IndividualService[]>([]);
    const [couples, setCouples] = useState<CoupleService[]>([]);
    const [loading, setLoading] = useState(true);

    const [isIndivModalOpen, setIsIndivModalOpen] = useState(false);
    const [selectedIndiv, setSelectedIndiv] = useState<IndividualService | null>(null);

    const [isCoupleModalOpen, setIsCoupleModalOpen] = useState(false);
    const [selectedCouple, setSelectedCouple] = useState<CoupleService | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [indivRes, coupleRes] = await Promise.all([
                api.get('/api/admin/photography/individual'),
                api.get('/api/admin/photography/couple')
            ]);
            setIndividuals(indivRes.data);
            setCouples(coupleRes.data);
        } catch (error) {
            console.error('Failed to fetch', error);
            toast.error('Không thể tải dữ liệu dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteIndiv = async (id: string) => {
        if (!confirm('Xóa dịch vụ này?')) return;
        try {
            await api.delete(`/api/admin/photography/individual/${id}`);
            fetchData();
            toast.success('Đã xóa');
        } catch (error) { toast.error('Lỗi khi xóa'); }
    };

    const handleDeleteCouple = async (id: string) => {
        if (!confirm('Xóa dịch vụ cặp đôi này?')) return;
        try {
            await api.delete(`/api/admin/photography/couple/${id}`);
            fetchData();
            toast.success('Đã xóa');
        } catch (error) { toast.error('Lỗi khi xóa'); }
    };

    const indivColumns = [
        { header: 'Tên dịch vụ', accessorKey: 'name' as keyof IndividualService },
        { header: 'Số lượng', accessorKey: 'quantity' as keyof IndividualService },
        {
            header: 'Giờ đầu',
            accessorKey: (row: IndividualService) => `${row.firstHour.toLocaleString()} VNĐ`
        },
        {
            header: 'Giờ thứ 2',
            accessorKey: (row: IndividualService) => `${row.secondHour.toLocaleString()} VNĐ`
        },
        {
            header: 'Thao tác',
            accessorKey: (row: IndividualService) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedIndiv(row); setIsIndivModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteIndiv(row.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    const coupleColumns = [
        {
            header: 'Giá/Giờ',
            accessorKey: (row: CoupleService) => `${row.rentalPricePerHour.toLocaleString()} VNĐ`
        },
        { header: 'Trang phục Nữ', accessorKey: 'clothingOfWomen' as keyof CoupleService },
        { header: 'Trang phục Nam', accessorKey: 'clothingOfMan' as keyof CoupleService },
        {
            header: 'Thao tác',
            accessorKey: (row: CoupleService) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedCouple(row); setIsCoupleModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCouple(row.id)}>
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
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Dịch vụ Chụp ảnh</h1>
                <p className="text-muted-foreground">Thiết lập các gói dịch vụ chụp ảnh cá nhân và cặp đôi.</p>
            </div>

            <Tabs defaultValue="individual" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="individual" className="flex gap-2 items-center">
                        <Camera className="h-4 w-4" /> Chụp cá nhân
                    </TabsTrigger>
                    <TabsTrigger value="couple" className="flex gap-2 items-center">
                        <Users className="h-4 w-4" /> Chụp cặp đôi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="individual" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Gói chụp cá nhân</CardTitle>
                                <CardDescription>Quản lý các gói chụp dựa trên số lượng người và giờ chụp.</CardDescription>
                            </div>
                            <Button onClick={() => { setSelectedIndiv(null); setIsIndivModalOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Thêm gói cá nhân
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={individuals} columns={indivColumns} placeholder="Tìm kiếm dịch vụ..." searchKey="name" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="couple" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Gói chụp cặp đôi</CardTitle>
                                <CardDescription>Quản lý giá thuê giờ và trang phục cho cặp đôi.</CardDescription>
                            </div>
                            <Button onClick={() => { setSelectedCouple(null); setIsCoupleModalOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Thêm gói cặp đôi
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={couples} columns={coupleColumns} placeholder="Tìm kiếm..." />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <IndividualPhotographyModal
                isOpen={isIndivModalOpen}
                onClose={() => setIsIndivModalOpen(false)}
                initialData={selectedIndiv}
                onSuccess={fetchData}
            />
            <CouplePhotographyModal
                isOpen={isCoupleModalOpen}
                onClose={() => setIsCoupleModalOpen(false)}
                initialData={selectedCouple}
                onSuccess={fetchData}
            />
        </div>
    );
}
