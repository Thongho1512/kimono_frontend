'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { PricingRuleModal, PhotoPackageModal, CouplePackageModal } from '@/components/admin/modals/pricing-modal';
import { Badge } from '@/components/ui/badge';

interface PricingRule {
    id: string;
    rentalTypeId: string;
    packageType: number;
    hours: number;
    price: number;
    currency: string;
}

interface PhotoPackage {
    id: string;
    minPeople: number;
    maxPeople: number;
    hours: number;
    price: number;
}

interface CouplePackage {
    id: string;
    rentalTypeId: string;
    name: string;
    price: number;
}

interface RentalType {
    id: string;
    slug: string;
    translations: { locale: string; name: string }[];
}

export default function PricingPage() {
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [photoPackages, setPhotoPackages] = useState<PhotoPackage[]>([]);
    const [couplePackages, setCouplePackages] = useState<CouplePackage[]>([]);
    const [rentalTypes, setRentalTypes] = useState<RentalType[]>([]);
    const [loading, setLoading] = useState(true);

    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);

    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoPackage | null>(null);

    const [isCoupleModalOpen, setIsCoupleModalOpen] = useState(false);
    const [selectedCouple, setSelectedCouple] = useState<CouplePackage | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rulesRes, photoRes, coupleRes, typesRes] = await Promise.all([
                api.get('/api/admin/pricing-rules').catch(() => ({ data: [] })),
                api.get('/api/admin/photo-packages').catch(() => ({ data: [] })),
                api.get('/api/admin/couple-packages').catch(() => ({ data: [] })),
                api.get('/api/admin/rental-types').catch(() => ({ data: [] }))
            ]);
            setRules(rulesRes.data);
            setPhotoPackages(photoRes.data);
            setCouplePackages(coupleRes.data);
            setRentalTypes(typesRes.data);
        } catch (error) {
            console.error('Failed to fetch pricing', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRule = () => { setSelectedRule(null); setIsRuleModalOpen(true); };
    const handleEditRule = (rule: PricingRule) => { setSelectedRule(rule); setIsRuleModalOpen(true); };

    const handleAddPhoto = () => { setSelectedPhoto(null); setIsPhotoModalOpen(true); };
    const handleEditPhoto = (pkg: PhotoPackage) => { setSelectedPhoto(pkg); setIsPhotoModalOpen(true); };

    const handleAddCouple = () => { setSelectedCouple(null); setIsCoupleModalOpen(true); };
    const handleEditCouple = (pkg: CouplePackage) => { setSelectedCouple(pkg); setIsCoupleModalOpen(true); };

    const handleDeleteRule = async (id: string) => {
        if (!confirm('Xóa?')) return;
        try { await api.delete(`/api/admin/pricing-rules/${id}`); fetchData(); toast.success('Đã xóa'); } catch (e) { toast.error('Lỗi'); }
    };

    const handleDeletePhoto = async (id: string) => {
        if (!confirm('Xóa?')) return;
        try { await api.delete(`/api/admin/photo-packages/${id}`); fetchData(); toast.success('Đã xóa'); } catch (e) { toast.error('Lỗi'); }
    };

    const handleDeleteCouple = async (id: string) => {
        if (!confirm('Xóa?')) return;
        try { await api.delete(`/api/admin/couple-packages/${id}`); fetchData(); toast.success('Đã xóa'); } catch (e) { toast.error('Lỗi'); }
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Quản lý Giá & Gói dịch vụ</h1>

            <Tabs defaultValue="rentals" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="rentals">Giá thuê Kimono</TabsTrigger>
                    <TabsTrigger value="photography">Dịch vụ Chụp ảnh</TabsTrigger>
                    <TabsTrigger value="couple">Gói Cặp đôi</TabsTrigger>
                </TabsList>

                <TabsContent value="rentals" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Bảng giá thuê Kimono</h3>
                        <Button size="sm" onClick={handleAddRule}><Plus className="mr-2 h-4 w-4" /> Thêm quy tắc giá</Button>
                    </div>
                    <DataTable
                        data={rules}
                        columns={[
                            {
                                header: 'Loại rental',
                                accessorKey: (row: PricingRule) => rentalTypes.find(t => t.id === row.rentalTypeId)?.translations?.find((tr: any) => tr.locale === 'vi' || tr.languageCode === 'vi')?.name || 'N/A'
                            },
                            { header: 'Giờ', accessorKey: (row: PricingRule) => `${row.hours}h` },
                            { header: 'Giá', accessorKey: (row: PricingRule) => `${row.price.toLocaleString()} ${row.currency}` },
                            {
                                header: 'Thao tác',
                                accessorKey: (row: PricingRule) => (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditRule(row)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteRule(row.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </TabsContent>

                <TabsContent value="photography" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Gói Chụp ảnh</h3>
                        <Button size="sm" onClick={handleAddPhoto}><Plus className="mr-2 h-4 w-4" /> Thêm gói chụp</Button>
                    </div>
                    <DataTable
                        data={photoPackages}
                        columns={[
                            { header: 'Số người', accessorKey: (row: PhotoPackage) => `${row.minPeople} - ${row.maxPeople}` },
                            { header: 'Thời gian', accessorKey: (row: PhotoPackage) => `${row.hours} giờ` },
                            { header: 'Giá', accessorKey: (row: PhotoPackage) => `${row.price.toLocaleString()} JPY` },
                            {
                                header: 'Thao tác',
                                accessorKey: (row: PhotoPackage) => (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditPhoto(row)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeletePhoto(row.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </TabsContent>

                <TabsContent value="couple" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Gói Chụp ảnh Cặp đôi</h3>
                        <Button size="sm" onClick={handleAddCouple}><Plus className="mr-2 h-4 w-4" /> Thêm gói cặp đôi</Button>
                    </div>
                    <DataTable
                        data={couplePackages}
                        columns={[
                            { header: 'Tên gói', accessorKey: 'name' as keyof CouplePackage },
                            { header: 'Giá', accessorKey: (row: CouplePackage) => `${row.price.toLocaleString()} JPY` },
                            {
                                header: 'Thao tác',
                                accessorKey: (row: CouplePackage) => (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditCouple(row)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCouple(row.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </TabsContent>
            </Tabs>

            <PricingRuleModal isOpen={isRuleModalOpen} onClose={() => setIsRuleModalOpen(false)} initialData={selectedRule} rentalTypes={rentalTypes} onSuccess={fetchData} />
            <PhotoPackageModal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} initialData={selectedPhoto} onSuccess={fetchData} />
            <CouplePackageModal isOpen={isCoupleModalOpen} onClose={() => setIsCoupleModalOpen(false)} initialData={selectedCouple} rentalTypes={rentalTypes} onSuccess={fetchData} />
        </div>
    );
}
