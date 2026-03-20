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

const userSchema = z.object({
    username: z.string().min(3, 'Username ít nhất 3 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Password ít nhất 6 ký tự').optional().or(z.literal('')),
    role: z.string().min(1, 'Bắt buộc chọn vai trò'),
});

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSuccess: () => void;
}

export function UserModal({ isOpen, onClose, initialData, onSuccess }: UserModalProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: initialData || { username: '', email: '', password: '', role: 'User' }
    });

    useEffect(() => {
        if (isOpen) form.reset(initialData || { username: '', email: '', password: '', role: 'User' });
    }, [isOpen, initialData, form]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (initialData) {
                // Remove password if empty during edit
                const { password, ...payload } = values;
                if (password) (payload as any).password = password;
                await api.put(`/api/admin/users/${initialData.id}`, payload);
            } else {
                await api.post('/api/admin/users', values);
            }
            toast.success('Thành công');
            onSuccess();
            onClose();
        } catch (error) { toast.error('Thất bại'); }
        finally { setLoading(false); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto duration-300">
                <DialogHeader><DialogTitle>{initialData ? 'Sửa người dùng' : 'Thêm Admin mới'}</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{initialData ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vai trò</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn vai trò..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="User">User</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter><Button type="submit" disabled={loading}>Lưu</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
