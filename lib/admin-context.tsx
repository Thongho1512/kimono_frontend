'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import api from './api';

interface AdminContextType {
  categories: any[];
  shopInfo: any;
  isLoadingCategories: boolean;
  isLoadingShopInfo: boolean;
  refreshCategories: () => Promise<void>;
  refreshShopInfo: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingShopInfo, setIsLoadingShopInfo] = useState(false);

  const refreshCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const res = await api.get('/api/admin/catalog/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const refreshShopInfo = useCallback(async () => {
    setIsLoadingShopInfo(true);
    try {
      const res = await api.get('/api/admin/shop-info');
      setShopInfo(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Set to empty object to indicate "no data" but "loading finished"
        setShopInfo({});
      } else {
        console.error('Failed to fetch shop info', err);
      }
    } finally {
      setIsLoadingShopInfo(false);
    }
  }, []);

  return (
    <AdminContext.Provider value={{ 
      categories, 
      shopInfo, 
      isLoadingCategories, 
      isLoadingShopInfo, 
      refreshCategories, 
      refreshShopInfo 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
