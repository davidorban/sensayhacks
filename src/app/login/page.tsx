'use client';

import { createClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sensay Prototypes Login</h1>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Access Restricted</AlertTitle>
          <AlertDescription className="text-blue-600">
            At this time, a @sensay.io email address is required to access the internal pages.
          </AlertDescription>
        </Alert>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
          theme="dark"
        />
      </div>
    </div>
  );
}
