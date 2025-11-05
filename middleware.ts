import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow static assets, API routes, and specific public pages
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/waitlist' ||
    pathname === '/ww-admin' ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Get auth token and user role from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value;
  const userId = request.cookies.get('user-id')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/auth/onboarding'];
  
  if (publicRoutes.includes(pathname)) {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (authToken && userRole) {
      if (userRole === 'renter') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else if (userRole === 'agent') {
        return NextResponse.redirect(new URL('/agent/dashboard', request.url));
      } else if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!authToken || !userRole || !userId) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Role-based route protection
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/agent') && userRole !== 'agent') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Renter routes
  if (
    (pathname.startsWith('/dashboard') || 
     pathname.startsWith('/properties') || 
     pathname.startsWith('/messages') || 
     pathname.startsWith('/saved') || 
     pathname.startsWith('/profile') ||
     pathname.startsWith('/applications')) && 
    userRole !== 'renter' && userRole !== 'admin'
  ) {
    if (userRole === 'agent') {
      return NextResponse.redirect(new URL('/agent/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};