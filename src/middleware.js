import { NextResponse } from 'next/server'

export function middleware(request) {
  // Middleware vacío que simplemente continúa la request
  return NextResponse.next()
}

export const config = {
  matcher: []
} 