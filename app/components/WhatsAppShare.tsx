"use client";

import { WhatsappIcon, WhatsappShareButton } from "react-share";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface WhatsAppShareProps {
  type: "friend" | "transaction";
  name: string;
  shareUrl: string;
  iconOnly?: boolean;
}

export default function WhatsAppShare({
  type,
  name,
  shareUrl,
  iconOnly = false,
}: WhatsAppShareProps) {
  const handleShare = () => {
    // Track successful sharing
    toast.success("WhatsApp ile paylaşılıyor");
  };

  const title =
    type === "friend"
      ? `BorçTakip - ${name} ile borç durumum`
      : `BorçTakip - İşlem: ${name}`;

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <WhatsappShareButton
        url={shareUrl}
        title={title}
        separator=" - "
        onClick={handleShare}
        className={`flex items-center gap-1 h-9 rounded-md px-3 text-sm font-medium 
          bg-[#25D366] hover:bg-[#1faa52] text-white transition-colors
          ${iconOnly ? "px-2.5" : "px-3"}`}
      >
        <WhatsappIcon size={18} round />
        {!iconOnly && <span>WhatsApp</span>}
      </WhatsappShareButton>
    </motion.div>
  );
}
