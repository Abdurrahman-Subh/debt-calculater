import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhasebeji - Borç Hesaplama ve Takip",
  description: "Arkadaşlarınızla borç alışverişini kolayca takip edin",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-background min-h-screen`}
      >
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#f8fafc)]" />

        <AuthProvider>
          <Header />

          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 relative">
            {children}
          </main>

          <footer className="py-6 border-t border-border mt-2">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} Muhasebeji. Tüm hakları
                saklıdır.
              </p>
            </div>
          </footer>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
