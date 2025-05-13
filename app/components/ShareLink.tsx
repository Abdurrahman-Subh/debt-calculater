"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share, Check, Copy, Link } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ShareLinkProps {
  type: "friend" | "transaction";
  id: string;
  name: string; // Friend's name or transaction description
}

export default function ShareLink({ type, id, name }: ShareLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a public share URL
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${type}/${id}`;
  };

  const shareUrl = generateShareUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Bağlantı panoya kopyalandı");

      // Reset copy state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Kopyalama işlemi başarısız oldu");
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BorçTakip - ${type === "friend" ? name : "İşlem Detayı"}`,
          text: `${
            type === "friend" ? `${name} ile borç durumu` : `İşlem: ${name}`
          }`,
          url: shareUrl,
        });
        toast.success("Başarıyla paylaşıldı");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Paylaşım sırasında bir hata oluştu");
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Open modal with copy link if Web Share API is not available
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleShare}
      >
        <Share className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Paylaş</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Link className="h-5 w-5 text-primary mr-2" />
              Paylaş
            </DialogTitle>
            <DialogDescription>
              Bu bağlantıyı arkadaşınızla paylaşın. Bağlantıya sahip olan herkes
              içeriği görüntüleyebilir.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-2">
            <div className="grid flex-1 gap-2">
              <div className="relative">
                <Input
                  value={shareUrl}
                  readOnly
                  className="pr-10 bg-muted/50 text-sm"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted"
                  aria-label="Kopyala"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? "Kopyalandı" : "Kopyala"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
