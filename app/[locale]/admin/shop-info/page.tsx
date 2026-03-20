'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Info, Share2, Clock, Phone, Store, MapPin, Mail, Sparkles } from 'lucide-react';

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
    const [info, setInfo] = useState<StoreInfo>(initialData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof StoreInfo, string>>>({});

    useEffect(() => {
        fetchShopInfo();
    }, []);

    const fetchShopInfo = async () => {
        try {
            const res = await api.get('/api/admin/shop-info');
            if (res.data) {
                setInfo(res.data);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.log('Chưa có thông tin cửa hàng, khởi tạo mới');
            } else {
                toast.error('Không thể tải thông tin cửa hàng');
            }
        } finally {
            setLoading(false);
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof StoreInfo, string>> = {};

        if (!info.name.trim()) newErrors.name = 'Tên cửa hàng không được để trống';
        if (!info.address.trim()) newErrors.address = 'Địa chỉ không được để trống';
        if (!info.openTime.trim()) newErrors.openTime = 'Giờ mở cửa không được để trống';
        if (!info.closeTime.trim()) newErrors.closeTime = 'Giờ đóng cửa không được để trống';

        if (!info.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!info.sdt.trim()) {
            newErrors.sdt = 'Số điện thoại không được để trống';
        } else if (!/^\d{10,11}$/.test(info.sdt)) {
            newErrors.sdt = 'Số điện thoại phải có 10-11 chữ số';
        }

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
                await fetchShopInfo(); // Get ID from server
            }
            toast.success('Đã cập nhật thông tin cửa hàng thành công');
        } catch (error) {
            toast.error('Không thể lưu thông tin. Vui lòng thử lại sau.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground italic">Đang tải dữ liệu...</p>
        </div>
    );

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
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Cột trái: Thông tin chính & Liên hệ */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Thông tin định danh */}
                        <Card className="shadow-md border-none ring-1 ring-neutral-200">
                            <CardHeader className="border-b bg-neutral-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Info className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Thông tin thương hiệu</CardTitle>
                                        <CardDescription>Tên và địa chỉ chính thức của cửa hàng</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name" className="text-sm font-semibold">Tên cửa hàng <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            value={info.name}
                                            onChange={e => updateField('name', e.target.value)}
                                            placeholder="VD: Ticktoc Kimono Store"
                                            className={`pl-10 h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-destructive font-medium italic">{errors.name}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="address" className="text-sm font-semibold">Địa chỉ cửa hàng <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="address"
                                            value={info.address}
                                            onChange={e => updateField('address', e.target.value)}
                                            placeholder="Số nhà, đường, quận/huyện, thành phố..."
                                            className={`pl-10 h-11 ${errors.address ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                                        />
                                    </div>
                                    {errors.address && <p className="text-xs text-destructive font-medium italic">{errors.address}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="nearbyPlaces" className="text-sm font-semibold">Địa điểm tham quan lân cận</Label>
                                    <div className="relative">
                                        <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <textarea
                                            id="nearbyPlaces"
                                            value={info.nearbyPlaces}
                                            onChange={e => updateField('nearbyPlaces', e.target.value)}
                                            placeholder="VD: Nhà Thờ Đức Bà, Bưu Điện Thành Phố, Chợ Bến Thành..."
                                            className="w-full min-h-[100px] pl-10 pt-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                        <Info className="h-3 w-3" /> Các địa điểm cách nhau bởi dấu phẩy (,)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thông tin liên hệ */}
                        <Card className="shadow-md border-none ring-1 ring-neutral-200">
                            <CardHeader className="border-b bg-neutral-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <Phone className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Kênh liên lạc</CardTitle>
                                        <CardDescription>Giúp khách hàng kết nối với bạn dễ dàng hơn</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="sdt" className="text-sm font-semibold">Số điện thoại <span className="text-destructive">*</span></Label>
                                        <Input id="sdt" value={info.sdt} onChange={e => updateField('sdt', e.target.value)} placeholder="0901 234 567" className="h-11" />
                                        {errors.sdt && <p className="text-xs text-destructive font-medium italic">{errors.sdt}</p>}
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="zalo" className="text-sm font-semibold">Zalo</Label>
                                        <Input id="zalo" value={info.zalo} onChange={e => updateField('zalo', e.target.value)} placeholder="0901 234 567" className="h-11" />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email" className="text-sm font-semibold">Email công việc <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" type="email" value={info.email} onChange={e => updateField('email', e.target.value)} placeholder="contact@ticktockimono.vn" className="pl-10 h-11" />
                                    </div>
                                    {errors.email && <p className="text-xs text-destructive font-medium italic">{errors.email}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cột phải: Thời gian & MXH */}
                    <div className="space-y-8">
                        {/* Thời gian */}
                        <Card className="shadow-md border-none ring-1 ring-neutral-200">
                            <CardHeader className="border-b bg-neutral-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Giờ hoạt động</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="openTime" className="text-xs uppercase tracking-wider text-muted-foreground">Mở cửa</Label>
                                        <Input id="openTime" type="time" value={info.openTime} onChange={e => updateField('openTime', e.target.value)} className="h-11 font-medium bg-neutral-50 focus:bg-white" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="closeTime" className="text-xs uppercase tracking-wider text-muted-foreground">Đóng cửa</Label>
                                        <Input id="closeTime" type="time" value={info.closeTime} onChange={e => updateField('closeTime', e.target.value)} className="h-11 font-medium bg-neutral-50 focus:bg-white" />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="dayOfWeek" className="text-sm font-semibold">Lịch làm việc</Label>
                                    <Input id="dayOfWeek" value={info.dayOfWeek} onChange={e => updateField('dayOfWeek', e.target.value)} placeholder="VD: Thứ 2 - Chủ Nhật" className="h-11" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mạng xã hội */}
                        <Card className="shadow-md border-none ring-1 ring-neutral-200">
                            <CardHeader className="border-b bg-neutral-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-500/10 rounded-lg">
                                        <Share2 className="h-5 w-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Mạng xã hội</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlFacebook" className="text-xs flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" /> Facebook
                                        </Label>
                                        <Input id="urlFacebook" value={info.urlFacebook} onChange={e => updateField('urlFacebook', e.target.value)} placeholder="https://..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlInstagram" className="text-xs flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#E4405F]" /> Instagram
                                        </Label>
                                        <Input id="urlInstagram" value={info.urlInstagram} onChange={e => updateField('urlInstagram', e.target.value)} placeholder="https://..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlTiktok" className="text-xs flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black" /> TikTok
                                        </Label>
                                        <Input id="urlTiktok" value={info.urlTiktok} onChange={e => updateField('urlTiktok', e.target.value)} placeholder="https://..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlYoutube" className="text-xs flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> YouTube
                                        </Label>
                                        <Input id="urlYoutube" value={info.urlYoutube} onChange={e => updateField('urlYoutube', e.target.value)} placeholder="https://..." className="bg-neutral-50 focus:bg-white transition-colors" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="urlThreads" className="text-xs flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" /> Threads
                                        </Label>
                                        <Input id="urlThreads" value={info.urlThreads} onChange={e => updateField('urlThreads', e.target.value)} placeholder="https://..." className="bg-neutral-50 focus:bg-white transition-colors" />
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
