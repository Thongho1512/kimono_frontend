'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/ticktoc/header').then(m => m.Header), { ssr: true });
const TopBar = dynamic(() => import('@/components/ticktoc/top-bar').then(m => m.TopBar), { ssr: false });
const Footer = dynamic(() => import('@/components/ticktoc/footer').then(m => m.Footer), { ssr: true });
const CherryBlossoms = dynamic(() => import('@/components/ticktoc/cherry-blossoms').then(m => m.CherryBlossoms), { ssr: false });
const ScrollToTop = dynamic(() => import('@/components/ticktoc/scroll-to-top').then(m => m.ScrollToTop), { ssr: false });
const SocialFloat = dynamic(() => import('@/components/ticktoc/social-float').then(m => m.SocialFloat), { ssr: false });

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
