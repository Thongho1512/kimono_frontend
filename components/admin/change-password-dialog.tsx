"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export function ChangePasswordDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { logout } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/api/auth/change-password", {
                currentPassword,
                newPassword
            });

            toast.success("Đổi mật khẩu thành công! Bạn sẽ đăng xuất sau 2 giây.");
            
            setTimeout(() => {
                logout();
            }, 2000);
            
            setOpen(false);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data || "Mật khẩu hiện tại không đúng hoặc đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-2 h-10 transition-all duration-200"
                >
                    <Lock className="h-4 w-4" />
                    <span className="truncate">Đổi mật khẩu</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogDescription>
                        Cập nhật mật khẩu mới cho tài khoản quản trị của bạn.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Xác nhận"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
