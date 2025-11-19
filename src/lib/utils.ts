import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// A standard helper for dynamic classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}