import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes and resolves conflicts
 * @param {...string} classes - Variadic list of Tailwind classes
 * @returns {string} - Merged and optimized Tailwind classes
 */
export function cn(...classes) {
  return twMerge(classes)
}
