'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await api.post('/api/auth/forgot-password', {});
            toast.success('Mã OTP đã được gửi đến email quản trị');
            setStep(2);
        } catch (error: any) {
            toast.error(error.response?.data || 'Không thể gửi mã OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Vui lòng nhập mã OTP 6 số');
            return;
        }
        setLoading(true);
        try {
            await api.post('/api/auth/verify-otp', { otp });
            toast.success('Xác thực thành công');
            setStep(3);
        } catch (error: any) {
            toast.error(error.response?.data || 'Mã OTP không chính xác');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        setLoading(true);
        try {
            await api.post('/api/auth/reset-password', { otp, newPassword });
            toast.success('Đặt lại mật khẩu thành công');
            setStep(4);
        } catch (error: any) {
            toast.error(error.response?.data || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={resetAndClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {step === 1 && <><Mail className="h-5 w-5" /> Quên mật khẩu</>}
                        {step === 2 && <><KeyRound className="h-5 w-5" /> Nhập mã xác thực</>}
                        {step === 3 && <><KeyRound className="h-5 w-5" /> Đặt mật khẩu mới</>}
                        {step === 4 && <><CheckCircle2 className="h-5 w-5 text-green-500" /> Thành công</>}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 && "Hệ thống sẽ gửi mã OTP đến email quản trị viên đã được cấu hình."}
                        {step === 2 && `Mã xác thực đã được gửi tới email quản trị (kyok***@gmail.com).`}
                        {step === 3 && "Thiết lập mật khẩu mới cho tài khoản của bạn."}
                        {step === 4 && "Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {step === 1 && (
                        <div className="py-6 text-center space-y-4">
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm font-medium">Nhấn nút bên dưới để nhận mã xác thực OTP gửi về email quản trị viên.</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-2">
                            <Label htmlFor="otp">Mã OTP (6 số)</Label>
                            <Input
                                id="otp"
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="text-center text-2xl tracking-[10px] font-bold"
                                disabled={loading}
                            />
                            <p className="text-[10px] text-muted-foreground mt-2 text-center font-medium italic">
                                * Mã OTP có hiệu lực trong vòng 2 tiếng.
                            </p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="py-4 text-center">
                            <p className="text-sm font-medium text-muted-foreground">Bạn có thể đóng cửa sổ này và đăng nhập lại.</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 1 && (
                        <Button onClick={handleSendOtp} className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Gửi mã OTP'}
                        </Button>
                    )}
                    {step === 2 && (
                        <div className="flex flex-col w-full gap-2">
                            <Button onClick={handleVerifyOtp} className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Xác thực OTP'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setStep(1)} disabled={loading}>
                                Quay lại
                            </Button>
                        </div>
                    )}
                    {step === 3 && (
                        <Button onClick={handleResetPassword} className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cập nhật mật khẩu'}
                        </Button>
                    )}
                    {step === 4 && (
                        <Button onClick={resetAndClose} className="w-full">
                            Đăng nhập ngay
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
