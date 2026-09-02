// apps/web/lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving conflicts with tailwind-merge.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
