import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "BorçTakip - Paylaşılan İçerik",
  description: "Arkadaşlar arasında borç takibi için paylaşılan içerik",
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-background">
        <div className="relative flex min-h-screen flex-col">
          <header className="border-b py-2 px-4">
            <div className="container max-w-screen-xl mx-auto flex items-center justify-between">
              <div className="font-bold text-primary text-lg">BorçTakip</div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/share/join">Hesap Oluştur</Link>
              </Button>
            </div>
          </header>
          <main className="flex-1">
            <div className="container max-w-screen-xl mx-auto py-4">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
