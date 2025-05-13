"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Friend } from "../types";
import { toast } from "sonner";

interface FriendFormProps {
  onAddFriend: (friend: Omit<Friend, "id">) => Promise<Friend>;
}

const FriendForm = ({ onAddFriend }: FriendFormProps) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Lütfen bir isim girin");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddFriend({ name: name.trim() });
      // Reset is handled in parent component
    } catch (error) {
      console.error("Failed to add friend:", error);
      toast.error("Arkadaş eklenirken bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 flex items-center">
        <UserPlus className="text-primary h-5 w-5 mr-2" />
        <h2 className="text-lg font-medium">Yeni Arkadaş Ekle</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="friendName" className="text-sm text-gray-500">
            Arkadaş Adı
          </Label>
          <Input
            id="friendName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arkadaş adını girin"
            aria-label="Arkadaş adı"
            className="bg-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-600"
          disabled={isSubmitting || !name.trim()}
        >
          {isSubmitting ? "Ekleniyor..." : "Arkadaş Ekle"}
        </Button>
      </form>
    </motion.div>
  );
};

export default FriendForm;
