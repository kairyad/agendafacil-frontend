import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')

    const { pathname } = request.nextUrl

    // Rotas públicas
    const publicRoutes = ['/', '/login', '/register']
    const isPublicRoute = publicRoutes.includes(pathname) ||
        pathname.match(/^\/[^\/]+$/) || // /{username}
        pathname.match(/^\/[^\/]+\/[^\/]+$/) // /{username}/{eventSlug}

    // Se não tem token e tenta acessar rota privada
    if (!token && !isPublicRoute && !pathname.startsWith('/api') && !pathname.startsWith('/auth/google/callback')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Se tem token e tenta acessar login/register
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
