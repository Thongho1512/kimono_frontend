'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatNumberWithCommas, parseFormattedNumber } from '@/lib/utils';

const ruleSchema = z.object({
    rentalTypeId: z.string().min(1, 'Bắt buộc chọn loại'),
    hours: z.any(),
    price: z.any(),
    currency: z.string().default('JPY'),
});

const photoSchema = z.object({
    minPeople: z.any(),
    maxPeople: z.any(),
    hours: z.any(),
    price: z.any(),
});

const coupleSchema = z.object({
    rentalTypeId: z.string().min(1, 'Bắt buộc chọn loại'),
    name: z.string().min(1, 'Bắt buộc nhập tên gói'),
    price: z.any(),
});

interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSuccess: () => void;
}

export function PricingRuleModal({ isOpen, onClose, initialData, rentalTypes, onSuccess }: GenericModalProps & { rentalTypes: any[] }) {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(ruleSchema),
        defaultValues: initialData || { rentalTypeId: '', hours: '', price: '', currency: 'JPY' }
    });

    useEffect(() => {
        if (isOpen) {
            const data = initialData || { rentalTypeId: '', hours: '', price: '', currency: 'JPY' };
            form.reset({
                ...data,
                hours: formatNumberWithCommas(data.hours),
                price: formatNumberWithCommas(data.price),
            });
        }
    }, [isOpen, initialData, form]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        const submitValues = {
            ...values,
            hours: parseFormattedNumber(values.hours?.toString()),
            price: parseFormattedNumber(values.price?.toString()),
        };
        try {
            if (initialData) await api.put(`/api/admin/pricing-rules/${initialData.id}`, submitValues);
            else await api.post('/api/admin/pricing-rules', submitValues);
            toast.success('Thành công');
            onSuccess(); onClose();
        } catch (error: any) { toast.error(error.response?.data?.message || 'Thất bại'); }
        finally { setLoading(false); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader><DialogTitle>{initialData ? 'Sửa quy tắc giá' : 'Thêm quy tắc giá'}</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="rentalTypeId" render={({ field }) => (
                            <FormItem><FormLabel>Loại Rental</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn loại..." /></SelectTrigger></FormControl>
                                    <SelectContent>{rentalTypes.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.translations?.find((tr: any) => tr.locale === 'vi' || tr.languageCode === 'vi')?.name || t.slug}</SelectItem>
                                    ))}</SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="hours" render={({ field }) => (
                                <FormItem><FormLabel>Số giờ</FormLabel><FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            field.onChange(formatNumberWithCommas(val));
                                        }}
                                        placeholder="0"
                                    />
                                </FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Giá</FormLabel><FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            field.onChange(formatNumberWithCommas(val));
                                        }}
                                        placeholder="0"
                                    />
                                </FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter><Button type="submit" disabled={loading}>Lưu</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function PhotoPackageModal({ isOpen, onClose, initialData, onSuccess }: GenericModalProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(photoSchema),
        defaultValues: initialData || { minPeople: '', maxPeople: '', hours: '', price: '' }
    });

    useEffect(() => {
        if (isOpen) {
            const data = initialData || { minPeople: '', maxPeople: '', hours: '', price: '' };
            form.reset({
                ...data,
                minPeople: formatNumberWithCommas(data.minPeople),
                maxPeople: formatNumberWithCommas(data.maxPeople),
                hours: formatNumberWithCommas(data.hours),
                price: formatNumberWithCommas(data.price),
            });
        }
    }, [isOpen, initialData, form]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        const submitValues = {
            ...values,
            minPeople: parseFormattedNumber(values.minPeople?.toString()),
            maxPeople: parseFormattedNumber(values.maxPeople?.toString()),
            hours: parseFormattedNumber(values.hours?.toString()),
            price: parseFormattedNumber(values.price?.toString()),
        };
        try {
            if (initialData) await api.put(`/api/admin/photo-packages/${initialData.id}`, submitValues);
            else await api.post('/api/admin/photo-packages', submitValues);
            toast.success('Thành công');
            onSuccess(); onClose();
        } catch (error: any) { toast.error(error.response?.data?.message || 'Thất bại'); }
        finally { setLoading(false); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader><DialogTitle>Gói Chụp ảnh</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="minPeople" render={({ field }) => (
                                <FormItem><FormLabel>Min người</FormLabel><FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            field.onChange(formatNumberWithCommas(val));
                                        }}
                                        placeholder="0"
                                    />
                                </FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="maxPeople" render={({ field }) => (
                                <FormItem><FormLabel>Max người</FormLabel><FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            field.onChange(formatNumberWithCommas(val));
                                        }}
                                        placeholder="0"
                                    />
                                </FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="hours" render={({ field }) => (
                            <FormItem><FormLabel>Số giờ</FormLabel><FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        field.onChange(formatNumberWithCommas(val));
                                    }}
                                    placeholder="0"
                                />
                            </FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Giá (JPY)</FormLabel><FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        field.onChange(formatNumberWithCommas(val));
                                    }}
                                    placeholder="0"
                                />
                            </FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter><Button type="submit" disabled={loading}>Lưu</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function CouplePackageModal({ isOpen, onClose, initialData, rentalTypes, onSuccess }: GenericModalProps & { rentalTypes: any[] }) {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(coupleSchema),
        defaultValues: initialData || { rentalTypeId: '', name: '', price: '' }
    });

    useEffect(() => {
        if (isOpen) {
            const data = initialData || { rentalTypeId: '', name: '', price: '' };
            form.reset({
                ...data,
                price: formatNumberWithCommas(data.price),
            });
        }
    }, [isOpen, initialData, form]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        const submitValues = {
            ...values,
            price: parseFormattedNumber(values.price?.toString()),
        };
        try {
            if (initialData) await api.put(`/api/admin/couple-packages/${initialData.id}`, submitValues);
            else await api.post('/api/admin/couple-packages', submitValues);
            toast.success('Thành công');
            onSuccess(); onClose();
        } catch (error: any) { toast.error(error.response?.data?.message || 'Thất bại'); }
        finally { setLoading(false); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader><DialogTitle>Gói Cặp đôi</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="rentalTypeId" render={({ field }) => (
                            <FormItem><FormLabel>Loại Rental (Chính)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn loại..." /></SelectTrigger></FormControl>
                                    <SelectContent>{rentalTypes.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.translations?.find((tr: any) => tr.locale === 'vi' || tr.languageCode === 'vi')?.name || t.slug}</SelectItem>
                                    ))}</SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Tên gói</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Giá (JPY)</FormLabel><FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        field.onChange(formatNumberWithCommas(val));
                                    }}
                                    placeholder="0"
                                />
                            </FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter><Button type="submit" disabled={loading}>Lưu</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
