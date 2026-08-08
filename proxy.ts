import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Central config — add/remove routes here, nowhere else
const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/register"]; // routes a logged-in user shouldn't see

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  ); // Not logged in, trying to access a protected route → send to login

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname); // optional: return here after login
    return NextResponse.redirect(loginUrl);
  } // Already logged in, trying to visit login/register → send to dashboard

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
