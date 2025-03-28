'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Redirect to home page after sign out.
    // AuthStatus component will update via onAuthStateChange.
    router.push('/'); 
    // router.refresh(); // Remove refresh for now
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
      title="Sign Out"
    >
      <LogOut className="h-5 w-5" />
      <span>Sign Out</span>
    </button>
  );
}
