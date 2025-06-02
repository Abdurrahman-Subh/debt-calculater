import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Muhasebeji - Borç Hesaplama ve Takip | Akıllı Borç Yönetimi",
  description:
    "Arkadaşlarınızla olan borç alışverişinizi kolayca takip edin. Akıllı hesaplama, kısmi ödemeler, detaylı raporlar ve daha fazlası. Ücretsiz başlayın!",
  keywords:
    "borç takip, borç hesaplama, arkadaş borçları, kısmi ödeme, muhasebeji, borç yönetimi",
  authors: [{ name: "Muhasebeji Team" }],
  creator: "Muhasebeji",
  openGraph: {
    title: "Muhasebeji - Akıllı Borç Takip Sistemi",
    description:
      "Arkadaşlarınızla olan borçlarınızı kolayca takip edin. Kısmi ödemeler, detaylı raporlar ve güvenli saklama.",
    url: "https://muhasebeji.com",
    siteName: "Muhasebeji",
    images: [
      {
        url: "/muhasebeji6.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhasebeji - Akıllı Borç Takip",
    description: "Arkadaşlarınızla olan borçlarınızı kolayca takip edin.",
    images: ["/muhasebeji6.png"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${inter.className} antialiased bg-background min-h-screen`}
      >
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#f8fafc)]" />
        <Analytics />
        <AuthProvider>
          <Header />

          <main className="mx-auto py-0 relative">{children}</main>

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
