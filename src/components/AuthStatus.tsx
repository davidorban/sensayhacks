import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SignOutButton from './SignOutButton'; // We can reuse the existing button
import { User } from 'lucide-react';

export default async function AuthStatus() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
      {session ? (
        <>
          <span className="text-sm text-gray-300 hidden sm:inline" title={session.user.email}>
            {session.user.email}
          </span>
          {/* Optionally show only icon on small screens */}
          <User className="h-5 w-5 text-gray-300 sm:hidden" /> 
          <SignOutButton />
        </>
      ) : (
        <Link
          href="/login"
          className="px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Login
        </Link>
      )}
    </div>
  );
}
