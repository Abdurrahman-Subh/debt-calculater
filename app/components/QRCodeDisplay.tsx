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
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { Download, QrCode, Share, Copy } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  title: string;
  description: string;
  shareUrl: string;
}

export default function QRCodeDisplay({
  title,
  description,
  shareUrl,
}: QRCodeDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("URL panoya kopyalandı");

      // Reset copy state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Kopyalama işlemi başarısız oldu");
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const canvas = document.getElementById("qr-canvas");
      if (!canvas) return;

      // Convert the SVG to a canvas
      const svg = document.getElementById("qr-code");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      // Create a blob from SVG data
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Create canvas and draw the QR code
        const canvas = document.createElement("canvas");
        canvas.width = 300; // Size of the downloaded image
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Create download link
        const downloadLink = document.createElement("a");
        downloadLink.download = `borctakip-${title
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`;
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.click();

        URL.revokeObjectURL(url);
        toast.success("QR kod indirildi");
      };

      img.src = url;
    } catch (err) {
      toast.error("QR kod indirilemedi");
      console.error("Failed to download QR code:", err);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <QrCode className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">QR Kod</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <QrCode className="h-5 w-5 text-primary mr-2" />
              QR Kod ile Paylaş
            </DialogTitle>
            <DialogDescription>
              Bu QR kodu arkadaşınız tarayarak bilgilere doğrudan erişebilir.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-xl border"
            >
              <QRCode
                id="qr-code"
                value={shareUrl}
                size={200}
                level="H"
                fgColor="#3b82f6" // Primary color
                bgColor="#ffffff"
              />
            </motion.div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p className="font-medium">{title}</p>
              <p>{description}</p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleCopy}
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Kopyalandı" : "URL Kopyala"}
            </Button>

            <Button
              type="button"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              QR Kodu İndir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
