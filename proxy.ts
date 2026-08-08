import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile'];
const authRoutes = ['/login', '/register'];

export function proxy(req: NextRequest) {
  const { nextUrl, cookies } = req;

  // 👇 اینجا باید توکن رو از کوکی بگیری
  const token = cookies.get('auth_token')?.value;

  const isLoggedIn = !!token;

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register'],
};
