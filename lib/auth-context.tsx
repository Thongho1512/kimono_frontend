'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check auth on mount or route change? 
    // Ideally, we persist user state or fetch profile if token exists.
    // Since we don't have a /me endpoint yet, we rely on stored user or decoded token?
    // Storing user in localStorage is insecure/unreliable for updates.
    // Better to have a /me endpoint or similar. 
    // For now, we'll try to refresh token to validate session and get user info if possible.

    const checkAuth = async () => {
        try {
            // Use /status instead of /refresh-token to avoid noisy 401 console errors
            const res = await api.get('/api/auth/status');

            if (res.data?.isAuthenticated && res.data?.user) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
            } else {
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (e: any) {
            if (e.response?.status !== 401) {
                console.error('Auth check failed', e);
            }
            localStorage.removeItem('user');
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Try to load cached user first for faster UI, then verify
        const cached = localStorage.getItem('user');
        if (cached) setUser(JSON.parse(cached));

        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const res = await api.post('/api/auth/login', credentials);
            const { user } = res.data;

            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            const locale = pathname.split('/')[1] || 'vi';
            router.push(`/${locale}/admin`);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/revoke');
        } catch (err) {
            console.error('Logout revocation failed', err);
        } finally {
            localStorage.removeItem('user');
            setUser(null);
            const locale = pathname.split('/')[1] || 'vi';
            router.push(`/${locale}/admin/login`);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
