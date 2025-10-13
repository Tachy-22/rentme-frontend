import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow home page, admin page, and static assets
  if (pathname === '/' || pathname === '/ww-admin' || pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)) {
    return NextResponse.next();
  }

  // Redirect all other routes to home page
  return NextResponse.redirect(new URL('/', request.url));
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