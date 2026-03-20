'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '../../hooks/use-debounce';

interface Option {
    label: string;
    value: string;
}

interface AutocompleteProps {
    value?: string;
    onValueChange: (value: string) => void;
    onSearch: (query: string) => Promise<Option[]>;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    initialOptions?: Option[];
}

export function Autocomplete({
    value,
    onValueChange,
    onSearch,
    placeholder = 'Tìm kiếm...',
    emptyMessage = 'Không tìm thấy kết quả.',
    className,
    initialOptions = [],
}: AutocompleteProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [options, setOptions] = React.useState<Option[]>(initialOptions);
    const [loading, setLoading] = React.useState(false);
    const debouncedQuery = useDebounce(query, 300);

    const fetchOptions = React.useCallback(async (q: string) => {
        setLoading(true);
        try {
            const results = await onSearch(q);
            setOptions(results);
        } catch (error) {
            console.error('Error fetching options:', error);
        } finally {
            setLoading(false);
        }
    }, [onSearch]);

    React.useEffect(() => {
        fetchOptions(debouncedQuery);
    }, [debouncedQuery, fetchOptions]);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between font-normal', className)}
                >
                    {selectedLabel || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={placeholder}
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!loading && options.length === 0 && (
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                        )}
                        {!loading && options.length > 0 && (
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={(currentValue) => {
                                            onValueChange(currentValue === value ? '' : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === option.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
