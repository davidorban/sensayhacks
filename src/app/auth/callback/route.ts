import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Use the server component helper
    const supabase = createServerComponentClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth Callback Error:', error.message);
      // Optionally redirect to an error page
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not authenticate user`);
    }
  }

  // URL to redirect to after sign in process completes
  // Middleware will intercept and redirect appropriately based on email domain
  return NextResponse.redirect(requestUrl.origin);
}
