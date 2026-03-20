'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Store,
    Images,
    ShoppingBag,
    Tags,
    LogOut,
    Menu,
    Scissors,
    Camera,
    ChevronLeft,
    User
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ChangePasswordDialog } from '@/components/admin/change-password-dialog';

const NAV_ITEMS = [
    { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Sản phẩm', icon: Store },
    { href: '/admin/categories', label: 'Danh mục', icon: Tags },
    { href: '/admin/hair-styles', label: 'Mẫu tóc', icon: Scissors },
    { href: '/admin/photography', label: 'Dịch vụ chụp ảnh', icon: Camera },
    { href: '/admin/albums', label: 'Album ảnh', icon: Images },
    { href: '/admin/shop-info', label: 'Cài đặt tiệm', icon: Store },
];

const NavContent = ({ pathname, locale, logout, setIsMobileOpen }: { pathname: string, locale: string, logout: () => void, setIsMobileOpen: (open: boolean) => void }) => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
        <div className="p-6 border-b border-slate-800">
            <Link href={`/${locale}/admin`} className="flex items-center gap-2">
                <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                <span className="text-xl font-bold text-white tracking-tight">Ticktoc Admin</span>
            </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => {
                const href = `/${locale}${item.href}`;
                const isActive = pathname === href;

                return (
                    <Link
                        key={item.href}
                        href={href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                            ? 'bg-primary text-white font-medium shadow-lg shadow-primary/20'
                            : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        onClick={() => setIsMobileOpen(false)}
                    >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
            <ChangePasswordDialog />
            <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400"
                onClick={() => logout()}
            >
                <LogOut className="h-4 w-4" />
                Đăng xuất
            </Button>
        </div>
    </div>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const locale = pathname?.split('/')[1] || 'vi';

    useEffect(() => {
        if (!loading && !user && !pathname?.includes('/login')) {
            router.push(`/${locale}/admin/login?error=unauthorized`);
        }
    }, [user, loading, router, pathname, locale]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 mb-4" />
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!user && !pathname?.includes('/login')) {
        return null;
    }

    if (pathname?.includes('/login')) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 h-screen sticky top-0 border-r shadow-sm overflow-hidden whitespace-nowrap">
                <NavContent pathname={pathname || ''} locale={locale} logout={logout} setIsMobileOpen={setIsMobileOpen} />
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Admin Header */}
                <header className="h-16 border-b bg-white dark:bg-slate-900 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden">
                            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-500">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-72 border-none">
                                    <SheetHeader className="sr-only">
                                        <SheetTitle>Admin Menu</SheetTitle>
                                        <SheetDescription>Phần dành cho quản trị viên</SheetDescription>
                                    </SheetHeader>
                                    <NavContent pathname={pathname || ''} locale={locale} logout={logout} setIsMobileOpen={setIsMobileOpen} />
                                </SheetContent>
                            </Sheet>
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
                            {NAV_ITEMS.find(item => `/${locale}${item.href}` === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href={`/${locale}`}>
                            <Button variant="outline" size="sm" className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-100 hidden md:flex">
                                <ChevronLeft className="h-4 w-4" />
                                Quay về trang khách hàng
                            </Button>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </Link>

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                                <User className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden lg:block">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="p-4 lg:p-8">
                        <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
