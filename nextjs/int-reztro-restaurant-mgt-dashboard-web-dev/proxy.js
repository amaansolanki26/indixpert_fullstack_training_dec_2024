import { NextResponse } from "next/server";

export function proxy(request) {

  const isLoggedIn =
    request.cookies.get("isLoggedIn");

  const { pathname } = request.nextUrl;


  const protectedRoutes = [
    "/dashboard",
    "/orders",
    "/messages",
    "/calendar",
    "/menu",
    "/inventory",
    "/purchase-order",
    "/reviews",
    "/drivers",
    "/customers",
  ];

  const isProtectedRoute =
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

  if (isProtectedRoute && !isLoggedIn) {

    return NextResponse.redirect(
      new URL("/signin", request.url)
    );
  }


  const authRoutes = [
    "/signin",
    "/signup",
    "/forget-password",
    "/reset-password",
    "/verify-email",
  ];

  const isAuthRoute =
    authRoutes.includes(pathname);

  if (isAuthRoute && isLoggedIn) {

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/messages/:path*",
    "/calendar/:path*",
    "/menu/:path*",
    "/inventory/:path*",
    "/purchase-order/:path*",
    "/reviews/:path*",
    "/drivers/:path*",
    "/customers/:path*",
    "/signin",
    "/signup",
    "/forget-password",
    "/reset-password/:path*",
    "/verify-email/:path*",
  ],
};