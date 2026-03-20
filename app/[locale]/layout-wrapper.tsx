'use client';

import { usePathname } from 'next/navigation';
import { Header } from "@/components/ticktoc/header";
import { TopBar } from "@/components/ticktoc/top-bar";
import { Footer } from "@/components/ticktoc/footer";
import { CherryBlossoms } from "@/components/ticktoc/cherry-blossoms";
import { ScrollToTop } from "@/components/ticktoc/scroll-to-top";
import { SocialFloat } from "@/components/ticktoc/social-float";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.includes('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <CherryBlossoms />
            <TopBar />
            <Header />
            <div className="min-h-screen">{children}</div>
            <Footer />
            <SocialFloat />
            <ScrollToTop />
        </>
    );
}
