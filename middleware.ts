import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an admin route
  // Path usually starts with /vi/admin or /en/admin etc.
  // We check if it contains /admin

  const isAdminRoute = pathname.includes('/admin');
  const isLoginPage = pathname.includes('/login');

  if (isAdminRoute && !isLoginPage) {
    // Basic check for refresh token cookie
    const refreshToken = request.cookies.get('refreshToken');

    if (!refreshToken) {
      // Get the locale from the path to redirect correctly?
      // Simple parsing:
      const segments = pathname.split('/');
      const locale = segments[1];

      // Check if locale is valid, imported from routing
      // If valid, redirect to localized login
      if (routing.locales.includes(locale as any)) {
        const loginUrl = new URL(`/${locale}/admin/login?error=unauthorized`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      // If locale is NOT valid (e.g. /admin), allow intlMiddleware to handle it.
      // intlMiddleware will redirect /admin -> /vi/admin (or default)
      // Then the new request will be caught by the block above.
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
