import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ottieni l'URL corrente
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Ottieni la lingua dal header Accept-Language
  const acceptLanguage = request.headers.get('accept-language') || '';
  const hasItalianPreference = acceptLanguage.includes('it');
  
  if (hasItalianPreference && !pathname.startsWith('/en') && !pathname.startsWith('/it')) {
    // Next.js già gestisce questo tramite i18n config, quindi lasciamo che lo faccia
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Escludiamo i file statici e le API
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}; 