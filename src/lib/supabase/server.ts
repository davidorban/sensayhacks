import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Renamed function for Server Components, Route Handlers, Server Actions
export function createServerComponentClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (_error) { // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // Server Components cannot set cookies directly
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (_error) { // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // Server Components cannot delete cookies directly
          }
        },
      },
    }
  )
}

// New function specifically for Middleware
export function createMiddlewareClient(req: NextRequest) {
  // Create a temporary response to handle cookie operations if needed
  let response = NextResponse.next({ request: { headers: new Headers(req.headers) } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update the cookies on the request and response
          req.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: new Headers(req.headers) } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Update the cookies on the request and response
          req.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: new Headers(req.headers) } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Return both the client and the potentially modified response
  return { supabase, response }
}
