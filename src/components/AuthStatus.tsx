'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import SignOutButton from './SignOutButton';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

export default function AuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
      {session ? (
        <>
          <span className="text-sm text-gray-300 hidden sm:inline" title={session.user.email ?? 'No Email'}>
            {session.user.email ?? 'User'}
          </span>
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
