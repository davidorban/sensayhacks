import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { createClient } from '@/lib/supabase/server'; 
import { cookies } from 'next/headers'; 
import SignOutButton from "@/components/SignOutButton"; 

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sensay Prototypes", 
  description: "Showcasing Sensay Hackathon Ideas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { session } } = await supabase.auth.getSession();

  const userEmail = session?.user?.email;
  const showSidebar = session && userEmail?.endsWith('@sensay.io');

  return (
    <html lang="en" className="h-full bg-gray-100">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex`}
      >
        {showSidebar ? (
          <Sidebar>
            <div className="mt-auto p-2">
              <SignOutButton />
            </div>
          </Sidebar>
        ) : null} 
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
