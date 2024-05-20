import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { authRoutes, publicRoutes } from "./routes";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin-room");
  const isMainPage = request.nextUrl.pathname === "/";
  const isAddProfilePage = request.nextUrl.pathname === "/profile/add-profile";

  if (isAdminRoute && !isMainPage) {
    if (session?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url), {
        status: 303,
      });
    }
  }

  if (
    !session &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/sign-up" &&
    !isPublicRoute
  ) {
    return NextResponse.redirect(new URL("/login", request.url), {
      status: 303,
    });
  }

  if (isAuthRoute && !isMainPage) {
    if (session && session.emailVerified) {
      return NextResponse.redirect(new URL("/", request.url), {
        status: 303,
      });
    }
  }

  if (session?.email && !session?.isUsernameMade && !isAddProfilePage) {
    return NextResponse.redirect(new URL("/profile/add-profile", request.url), {
      status: 303,
    });
  }

  if (session?.username && session?.isUsernameMade && isAddProfilePage && !isMainPage) {
    return NextResponse.redirect(new URL("/", request.url), {
      status: 303,
    });
  }

  if (
    !session?.emailVerified &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/sign-up" &&
    !isPublicRoute
  ) {
    return NextResponse.redirect(new URL("/login", request.url), {
      status: 303,
    });
  }

  return null;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
