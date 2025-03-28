import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of routes accessible without authentication
const publicRoutes = ['/', '/login', '/auth/callback', '/privacy', '/terms', '/overview'];

// List of routes accessible only to authenticated users with specific domain
const protectedInternalRoutesPrefix = '/prototypes';

// The domain required for internal access
const requiredDomain = 'sensay.io';

export async function middleware(req: NextRequest) {
  // Create an unmodified response
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request and response cookies
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request and response cookies
          req.cookies.set({ name, value: '', ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if expired - important!
  // This will also load the session into the client
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Allow access to public routes regardless of auth status
  if (isPublicRoute) {
    return res;
  }

  // If user is not logged in and trying to access a non-public route, redirect to login
  if (!session) {
    console.log('Middleware: No session, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // User is logged in, check email domain for protected routes
  const userEmail = session.user?.email;
  const isAllowedDomain = userEmail?.endsWith(`@${requiredDomain}`);

  // Check if accessing protected internal routes
  if (pathname.startsWith(protectedInternalRoutesPrefix)) {
    if (isAllowedDomain) {
      console.log(`Middleware: Access granted to ${pathname} for ${userEmail}`);
      return res; // Allow access for correct domain
    } else {
      console.log(`Middleware: Access denied to ${pathname} for ${userEmail}, redirecting to /overview`);
      // Redirect non-sensay.io users trying to access prototypes to the overview page
      return NextResponse.redirect(new URL('/overview', req.url));
    }
  }

  // Allow access to any other authenticated routes (should not be any currently based on logic)
  console.log(`Middleware: Allowing access to ${pathname} for ${userEmail} (default)`);
  return res; // Return the potentially modified response
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes, if any - none currently)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
