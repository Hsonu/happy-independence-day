import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Tiranga Connect 🇮🇳 | One Connection. One Nation. One India.",
  description: "Celebrate Independence Day by building connections. Share your referral link and grow your network on Tiranga Connect — a social referral visualization platform.",
  keywords: ["Tiranga Connect", "Independence Day", "referral network", "15 August", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-gray-950">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
                {children}
              </main>
            </div>
            <MobileNav />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
