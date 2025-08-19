import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n, isValidLocale } from './lib/i18n'

function getLocale(request: NextRequest): string {
  // Check if locale is in pathname
  const pathname = request.nextUrl.pathname
  const pathnameLocale = pathname.split('/')[1]
  
  if (isValidLocale(pathnameLocale)) {
    return pathnameLocale
  }

  // Return default locale instead of checking Accept-Language header
  // This ensures first visits always go to the configured default locale
  return i18n.defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files and API routes
  if (
    pathname.includes('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return
  }

  // Check if pathname starts with locale
  const pathnameLocale = pathname.split('/')[1]
  
  // If pathname doesn't start with a valid locale, redirect to locale-prefixed path
  if (!isValidLocale(pathnameLocale)) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    
    return NextResponse.redirect(newUrl)
  }

  // If pathname starts with a valid locale, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, _vercel)
    '/((?!_next|_vercel|.*\\..*|api/).*)',
  ],
}
