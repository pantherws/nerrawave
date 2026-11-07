import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Subtle focus ring — matches homepage upload / language controls */
export const focusRingSoft =
  'outline-none focus-visible:ring-1 focus-visible:ring-ring/35 focus-visible:ring-offset-0'

/** For Radix controls that use `:focus` while open (e.g. Select trigger) */
export const focusRingSoftFocus =
  'outline-none focus:ring-1 focus:ring-ring/35 focus:ring-offset-0'
