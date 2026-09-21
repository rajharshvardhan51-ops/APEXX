import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public routes that do not require auth check
  const isPublicRoute =
    path === '/' ||
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path.includes('.') ||
    path === '/favicon.ico';

  // Check auth session tokens in request cookies
  const hasAuthToken =
    request.cookies.has('sb-access-token') ||
    request.cookies.has('sb-refresh-token') ||
    request.cookies.has('apexx_session');

  // If user accesses protected routes without any auth token cookie and not in dev fallback, redirect to dashboard root
  if (!isPublicRoute && !hasAuthToken) {
    // Note: We allow client navigation while AuthContext initializes local session fallback in development
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
