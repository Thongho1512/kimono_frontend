'use client';

import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { ForgotPasswordModal } from '@/components/admin/modals/forgot-password-modal';

const loginSchema = z.object({
    username: z.string().min(1, 'Vui lòng nhập tài khoản'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    useEffect(() => {
        const errorType = searchParams.get('error');
        if (errorType === 'unauthorized') {
            setError('Bạn phải đăng nhập để truy cập trang quản trị');
            toast.error('Vui lòng đăng nhập trước');
        }
    }, [searchParams]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setError(null);
        try {
            await login(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20 px-4">
            <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-primary">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center">Đăng nhập Admin</CardTitle>
                    <CardDescription className="text-center">
                        Hệ thống quản lý Ticktoc Kimono
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="bg-destructive/10">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Tên đăng nhập</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="admin"
                                disabled={loading}
                                className="h-11"
                                {...form.register('username')}
                            />
                            {form.formState.errors.username && (
                                <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                disabled={loading}
                                className="h-11"
                                {...form.register('password')}
                            />
                            {form.formState.errors.password && (
                                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                            )}
                            <div className="flex justify-end mt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPasswordOpen(true)}
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Đăng nhập'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground border-t pt-4">
                    <p>Ticktoc Kimono Rental & Pricing Management</p>
                    <p>© 2024 Design by Boty Software</p>
                </CardFooter>
            </Card>

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
            />
        </div>
    );
}
