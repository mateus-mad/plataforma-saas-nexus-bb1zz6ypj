/* General utility functions (exposes cn) */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates compliance status based on the expiry date
 */
export function calculateComplianceStatus(
  expiryDate?: string | null,
): 'vencido' | 'em_dia' | 'pendente' {
  if (!expiryDate) return 'pendente'
  const expiry = new Date(expiryDate)
  if (isNaN(expiry.getTime())) return 'pendente'

  const now = new Date()
  expiry.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)

  if (expiry.getTime() < now.getTime()) {
    return 'vencido'
  }
  return 'em_dia'
}
