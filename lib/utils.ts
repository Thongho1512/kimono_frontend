import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithCommas(value: string | number): string {
  if (value === undefined || value === null || value === '') return '';
  const number = parseFloat(value.toString().replace(/,/g, ''));
  if (isNaN(number)) return '';
  return number.toLocaleString('en-US');
}

export function parseFormattedNumber(value: string): number {
  if (!value) return 0;
  const sanitized = value.replace(/,/g, '');
  const number = parseFloat(sanitized);
  return isNaN(number) ? 0 : number;
}
