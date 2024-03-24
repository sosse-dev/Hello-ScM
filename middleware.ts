import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  return NextResponse.next({
    request: {
      headers: requestHeaders
    },
  });
}

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) return token?.role === "admin";
      return !!token;
    },
  },
});

export const config = { matcher: ["/admin:path*", "/profile"] };

