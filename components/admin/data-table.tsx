'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column<T> {
    header: string;
    accessorKey: keyof T | ((row: T) => React.ReactNode);
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKey?: keyof T;
    placeholder?: string;
    onAdd?: () => void;
    addLabel?: string;
}

export function DataTable<T>({
    data,
    columns,
    searchKey,
    placeholder = "Tìm kiếm...",
    onAdd,
    addLabel = "Thêm mới"
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = data.filter((item) => {
        if (!searchKey || !searchQuery) return true;
        const value = item[searchKey];
        if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const renderCell = (item: T, column: Column<T>) => {
        if (typeof column.accessorKey === 'function') {
            return column.accessorKey(item);
        }
        return item[column.accessorKey] as React.ReactNode;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                {onAdd && (
                    <Button onClick={onAdd}>{addLabel}</Button>
                )}
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableHead key={index}>{column.header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={colIndex}>
                                            {renderCell(item, column)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không tìm thấy kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
