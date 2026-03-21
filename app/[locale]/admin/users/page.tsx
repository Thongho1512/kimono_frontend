'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Edit, User as UserIcon, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { UserModal } from '@/components/admin/modals/user-modal';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/users').catch(() => ({ data: [] }));
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => { setSelectedUser(null); setIsModalOpen(true); };
    const handleEdit = (user: User) => { setSelectedUser(user); setIsModalOpen(true); };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await api.delete(`/api/admin/users/${id}`);
            fetchData();
            toast.success('Đã xóa người dùng');
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;

    const columns = [
        {
            header: 'Username',
            accessorKey: (row: User) => (
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 opacity-50" />
                    <span className="font-medium">{row.username}</span>
                </div>
            )
        },
        { header: 'Email', accessorKey: 'email' as keyof User },
        {
            header: 'Vai trò',
            accessorKey: (row: User) => row.role === 'Admin' ? (
                <Badge className="bg-amber-500 hover:bg-amber-600"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>
            ) : (
                <Badge variant="outline">User</Badge>
            )
        },
        {
            header: 'Thao tác',
            accessorKey: (row: User) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
                <Button onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Thêm Admin</Button>
            </div>

            <DataTable
                data={users}
                columns={columns}
                placeholder="Tìm username..."
                searchKey="username"
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedUser}
                onSuccess={fetchData}
            />
        </div>
    );
}
