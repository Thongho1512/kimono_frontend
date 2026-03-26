'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Info, Share2, Clock, Phone, Store, MapPin, Mail, Sparkles } from 'lucide-react';

import { useTranslations } from 'next-intl';
import { useAdmin } from '@/lib/admin-context';
import { FormSkeleton } from '@/components/admin/skeleton-ui';

interface StoreInfo {
    id?: string;
    name: string;
    address: string;
    openTime: string;
    closeTime: string;
    dayOfWeek: string;
    zalo: string;
    email: string;
    sdt: string;
    nearbyPlaces: string;
    urlFacebook: string;
    urlTiktok: string;
    urlInstagram: string;
    urlYoutube: string;
    urlThreads: string;
}

const initialData: StoreInfo = {
    name: '',
    address: '',
    openTime: '08:00',
    closeTime: '20:00',
    dayOfWeek: 'Thứ 2 - Chủ Nhật',
    zalo: '',
    email: '',
    sdt: '',
    nearbyPlaces: '',
    urlFacebook: '',
    urlTiktok: '',
    urlInstagram: '',
    urlYoutube: '',
    urlThreads: ''
};

export default function ShopInfoPage() {
    const t = useTranslations('admin.shopInfo');
    const { shopInfo, isLoadingShopInfo, refreshShopInfo } = useAdmin();
    const [info, setInfo] = useState<StoreInfo>(initialData);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof StoreInfo, string>>>({});

    useEffect(() => {
        if (shopInfo) {
            setInfo(shopInfo);
        } else if (!isLoadingShopInfo) {
            refreshShopInfo();
        }
    }, [shopInfo, isLoadingShopInfo, refreshShopInfo]);


    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof StoreInfo, string>> = {};

        const urlPattern = /^https?:\/\/.+/;
        if (info.urlFacebook && !urlPattern.test(info.urlFacebook)) newErrors.urlFacebook = 'URL không hợp lệ';
        if (info.urlTiktok && !urlPattern.test(info.urlTiktok)) newErrors.urlTiktok = 'URL không hợp lệ';
        if (info.urlInstagram && !urlPattern.test(info.urlInstagram)) newErrors.urlInstagram = 'URL không hợp lệ';
        if (info.urlYoutube && !urlPattern.test(info.urlYoutube)) newErrors.urlYoutube = 'URL không hợp lệ';
        if (info.urlThreads && !urlPattern.test(info.urlThreads)) newErrors.urlThreads = 'URL không hợp lệ';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
            return;
        }

        setSaving(true);
        try {
            if (info.id) {
                await api.put('/api/admin/shop-info', info);
            } else {
                await api.post('/api/admin/shop-info', info);
            }
            toast.success('Đã cập nhật thông tin cửa hàng thành công');
            refreshShopInfo();
        } catch (error) {
            toast.error('Không thể lưu thông tin. Vui lòng thử lại sau.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (isLoadingShopInfo && !info.id) return <FormSkeleton />;

    const updateField = (field: keyof StoreInfo, value: string) => {
        setInfo(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý thông tin cửa hàng</h1>
                    <p className="text-muted-foreground mt-1">Cập nhật thông tin chi tiết hiển thị trên website chính thức.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Lưu thông tin
                </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-8 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột trái: Địa điểm tham quan */}
                    <div className="space-y-8">
                        <Card className="shadow-md border-none ring-1 ring-neutral-200 h-full">
                            <CardHeader className="border-b bg-neutral-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Địa điểm lân cận</CardTitle>
                                        <CardDescription>Các địa danh nổi tiếng gần cửa hàng</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="nearbyPlaces" className="text-sm font-semibold">Danh sách địa điểm</Label>
                                    <div className="relative">
                                        <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <textarea
                                            id="nearbyPlaces"
                                            value={info.nearbyPlaces}
                                            onChange={e => updateField('nearbyPlaces', e.target.value)}
                                            placeholder="VD: Nhà Thờ Đức Bà, Bưu Điện Thành Phố, Chợ Bến Thành..."
                                            className="w-full min-h-[200px] pl-10 pt-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                        <Info className="h-3 w-3" /> Các địa điểm cách nhau bởi dấu phẩy (,)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cột phải: Mạng xã hội */}
                    <div className="space-y-8">
                        <Card className="shadow-md border-none ring-1 ring-neutral-200">
                            <CardHeader className="border-b bg-neutral-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-500/10 rounded-lg">
                                        <Share2 className="h-5 w-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Mạng xã hội</CardTitle>
                                        <CardDescription>Các liên kết mạng xã hội chính thức</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlFacebook" className="text-xs flex items-center gap-2 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" /> Facebook
                                        </Label>
                                        <Input id="urlFacebook" value={info.urlFacebook} onChange={e => updateField('urlFacebook', e.target.value)} placeholder="https://facebook.com/..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                        {errors.urlFacebook && <p className="text-xs text-destructive font-medium italic">{errors.urlFacebook}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlInstagram" className="text-xs flex items-center gap-2 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#E4405F]" /> Instagram
                                        </Label>
                                        <Input id="urlInstagram" value={info.urlInstagram} onChange={e => updateField('urlInstagram', e.target.value)} placeholder="https://instagram.com/..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                        {errors.urlInstagram && <p className="text-xs text-destructive font-medium italic">{errors.urlInstagram}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlTiktok" className="text-xs flex items-center gap-2 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black" /> TikTok
                                        </Label>
                                        <Input id="urlTiktok" value={info.urlTiktok} onChange={e => updateField('urlTiktok', e.target.value)} placeholder="https://tiktok.com/@..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                        {errors.urlTiktok && <p className="text-xs text-destructive font-medium italic">{errors.urlTiktok}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlYoutube" className="text-xs flex items-center gap-2 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> YouTube
                                        </Label>
                                        <Input id="urlYoutube" value={info.urlYoutube} onChange={e => updateField('urlYoutube', e.target.value)} placeholder="https://youtube.com/..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                        {errors.urlYoutube && <p className="text-xs text-destructive font-medium italic">{errors.urlYoutube}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlThreads" className="text-xs flex items-center gap-2 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" /> Threads
                                        </Label>
                                        <Input id="urlThreads" value={info.urlThreads} onChange={e => updateField('urlThreads', e.target.value)} placeholder="https://threads.net/..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                        {errors.urlThreads && <p className="text-xs text-destructive font-medium italic">{errors.urlThreads}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
