'use client';

import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const supabase = createClient();

  const handleSignOut = async () => {
    // console.log('SignOutButton clicked'); // Remove log
    await supabase.auth.signOut();
    // Force a full page reload to the home page.
    // This ensures the server renders the layout correctly for logged-out state.
    window.location.assign('/'); 
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
