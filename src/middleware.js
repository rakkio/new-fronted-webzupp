import { NextResponse } from 'next/server';

export function middleware(request) {
  // Obtener la URL actual
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Si la ruta comienza con /en, redirigir a la misma ruta pero sin el prefijo /en
  if (pathname.startsWith('/en')) {
    // Eliminar el prefijo /en
    const newPath = pathname.replace(/^\/en/, '') || '/';
    
    // Crear nueva URL sin el prefijo /en
    url.pathname = newPath;
    
    // Redirigir permanentemente a la URL sin el prefijo
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  // Aplicar este middleware a todas las rutas
  matcher: '/:path*',
}; 