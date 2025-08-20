import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for the current environment
 */
export function getBaseUrl(request?: Request): string {
  // Try to get from environment variable first
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // If we have a request object, derive from it
  if (request) {
    const url = new URL(request.url);
    const protocol = url.protocol;
    const host = url.host;
    return `${protocol}//${host}`;
  }
  
  // Fallback for development
  return process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' // You should set this in production
    : 'http://localhost:3001';
}

/**
 * Convert a relative media path to a full URL
 */
export function getFullMediaUrl(relativePath: string | null | undefined, request?: Request): string | null {
  if (!relativePath) return null;
  
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Convert relative path to full URL
  const baseUrl = getBaseUrl(request);
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${baseUrl}${cleanPath}`;
}
