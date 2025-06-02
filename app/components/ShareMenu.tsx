"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  XIcon,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  EmailIcon,
  EmailShareButton,
} from "react-share";
import QRCodeDisplay from "./QRCodeDisplay";

interface ShareMenuProps {
  type: "friend" | "transaction";
  id: string;
  name: string;
}

export default function ShareMenu({ type, id, name }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  // Generate a public share URL
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${type}/${id}`;
  };

  const shareUrl = generateShareUrl();

  const title =
    type === "friend"
      ? `Muhasebeji - ${name} ile borç durumum`
      : `Muhasebeji - İşlem: ${name}`;

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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text:
            type === "friend" ? `${name} ile borç durumu` : `İşlem: ${name}`,
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
      // Fallback if Web Share API is not available
      handleCopy();
    }
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Share className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paylaş</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <motion.div
            className="p-2 grid gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            <DropdownMenuSeparator />

            {/* Social share buttons */}
            <div className="grid grid-cols-4 gap-2">
              <motion.div
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <WhatsappShareButton
                  url={shareUrl}
                  title={title}
                  className="w-full"
                >
                  <div className="flex flex-col items-center">
                    <WhatsappIcon size={32} round />
                    <span className="text-xs mt-1">WhatsApp</span>
                  </div>
                </WhatsappShareButton>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <FacebookShareButton
                  url={shareUrl}
                  hashtag="#Muhasebeji"
                  className="w-full"
                >
                  <div className="flex flex-col items-center">
                    <FacebookIcon size={32} round />
                    <span className="text-xs mt-1">Facebook</span>
                  </div>
                </FacebookShareButton>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <TwitterShareButton
                  url={shareUrl}
                  title={title}
                  className="w-full"
                >
                  <div className="flex flex-col items-center">
                    <XIcon size={32} round />
                    <span className="text-xs mt-1">X</span>
                  </div>
                </TwitterShareButton>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <TelegramShareButton
                  url={shareUrl}
                  title={title}
                  className="w-full"
                >
                  <div className="flex flex-col items-center">
                    <TelegramIcon size={32} round />
                    <span className="text-xs mt-1">Telegram</span>
                  </div>
                </TelegramShareButton>
              </motion.div>
            </div>

            <motion.div
              whileTap={{ scale: 0.95 }}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <EmailShareButton
                url={shareUrl}
                subject={title}
                body={`${title}\n\n`}
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <EmailIcon className="mr-2 h-4 w-4" round size={16} />
                  E-posta ile Gönder
                </Button>
              </EmailShareButton>
            </motion.div>

            <DropdownMenuSeparator />

            {/* Copy link button */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleCopy}
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Kopyalandı" : "Bağlantıyı Kopyala"}
              </Button>
            </motion.div>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-2">
        <QRCodeDisplay
          title={
            type === "friend" ? `${name} ile Borç Durumu` : `İşlem: ${name}`
          }
          description={
            type === "friend"
              ? "Bu QR kodu tarayarak borç durumunu görüntüleyin"
              : "Bu QR kodu tarayarak işlem detaylarını görüntüleyin"
          }
          shareUrl={shareUrl}
        />
      </div>
    </div>
  );
}
