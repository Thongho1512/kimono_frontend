'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { 
    X, 
    Plus, 
    Trash2, 
    User, 
    Phone, 
    Mail, 
    Calendar as CalendarIcon, 
    Clock, 
    Users,
    Search
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateBookingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateBookingDialog({ isOpen, onClose, onSuccess }: CreateBookingDialogProps) {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [products, setProducts] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            arrivalTime: '09:00',
            numberOfPeople: 1,
            note: ''
        }
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Public/products`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        if (isOpen) {
            fetchProducts();
            reset();
            setSelectedItems([]);
            setDate(new Date());
        }
    }, [isOpen, reset]);

    const addItem = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existing = selectedItems.find(item => item.productId === productId);
        if (existing) {
            setSelectedItems(selectedItems.map(item => 
                item.productId === productId 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ));
        } else {
            setSelectedItems([...selectedItems, {
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: 1
            }]);
        }
    };

    const removeItem = (productId: string) => {
        setSelectedItems(selectedItems.filter(item => item.productId !== productId));
    };

    const onSubmit = async (data: any) => {
        if (!date) {
            toast.error('Vui lòng chọn ngày');
            return;
        }
        if (selectedItems.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 dịch vụ');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...data,
                rentalDate: format(date, 'yyyy-MM-dd'),
                items: selectedItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create booking');

            toast.success('Tạo đơn đặt lịch thành công');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating booking:', error);
            toast.error('Không thể tạo đơn đặt lịch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Plus className="h-6 w-6 text-primary" />
                        Tạo đơn đặt lịch mới
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="customerName">Họ và tên</Label>
                                    <Input 
                                        id="customerName" 
                                        {...register('customerName', { required: 'Yêu cầu nhập tên' })} 
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message as string}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="customerPhone">Số điện thoại</Label>
                                    <Input 
                                        id="customerPhone" 
                                        {...register('customerPhone', { required: 'Yêu cầu nhập SĐT' })} 
                                        placeholder="0123456789"
                                    />
                                    {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone.message as string}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="customerEmail">Email</Label>
                                    <Input 
                                        id="customerEmail" 
                                        type="email"
                                        {...register('customerEmail', { required: 'Yêu cầu nhập email' })} 
                                        placeholder="example@gmail.com"
                                    />
                                    {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail.message as string}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Chi tiết lịch hẹn
                            </h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Ngày thuê</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="arrivalTime">Giờ đến</Label>
                                        <Input 
                                            id="arrivalTime" 
                                            type="time"
                                            {...register('arrivalTime', { required: true })} 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="numberOfPeople">Số người</Label>
                                        <Input 
                                            id="numberOfPeople" 
                                            type="number"
                                            min={1}
                                            {...register('numberOfPeople', { required: true, min: 1 })} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="note">Ghi chú</Label>
                                    <Textarea id="note" {...register('note')} placeholder="Yêu cầu đặc biệt..." rows={2} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Services / Products Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Dịch vụ & Gói thuê
                        </h3>
                        
                        <div className="flex gap-2">
                            <Select onValueChange={addItem}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Chọn gói thuê / dịch vụ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(p => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name} - {p.price.toLocaleString()} ¥
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 border rounded-lg p-2 bg-slate-50 dark:bg-slate-900/50 min-h-[100px]">
                            {selectedItems.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-8 italic">Chưa chọn dịch vụ nào</p>
                            ) : (
                                selectedItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded border shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-primary/10 text-primary p-1 rounded">
                                                <Plus className="h-3 w-3" />
                                            </div>
                                            <span className="text-sm font-medium">{item.productName}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border rounded">
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 rounded-none border-r"
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            setSelectedItems(selectedItems.map(i => i.productId === item.productId ? {...i, quantity: i.quantity - 1} : i));
                                                        }
                                                    }}
                                                >
                                                    -
                                                </Button>
                                                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 rounded-none border-l"
                                                    onClick={() => {
                                                        setSelectedItems(selectedItems.map(i => i.productId === item.productId ? {...i, quantity: i.quantity + 1} : i));
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <span className="text-sm font-bold w-20 text-right">{(item.price * item.quantity).toLocaleString()} ¥</span>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => removeItem(item.productId)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {selectedItems.length > 0 && (
                            <div className="flex justify-end p-2">
                                <p className="text-lg font-bold">
                                    Tổng cộng: {selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()} ¥
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                            Tạo đơn
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Separator() {
    return <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-2" />;
}
