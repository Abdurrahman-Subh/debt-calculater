"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCog } from "lucide-react";
import { Friend } from "../types";
import { toast } from "sonner";

interface FriendFormProps {
  onAddFriend: (friend: Omit<Friend, "id" | "userId">) => Promise<Friend>;
  onUpdateFriend?: (id: string, name: string) => Promise<Friend>;
  initialFriend?: Friend;
  isEditing?: boolean;
}

const FriendForm = ({
  onAddFriend,
  onUpdateFriend,
  initialFriend,
  isEditing = false,
}: FriendFormProps) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialFriend) {
      setName(initialFriend.name);
    }
  }, [initialFriend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Lütfen bir isim girin");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && initialFriend && onUpdateFriend) {
        await onUpdateFriend(initialFriend.id, name.trim());
        toast.success("Arkadaş başarıyla güncellendi");
      } else {
        await onAddFriend({ name: name.trim() });
        // Reset only when adding, not when editing
        if (!isEditing) {
          setName("");
        }
      }
    } catch (error) {
      console.error(
        isEditing ? "Failed to update friend:" : "Failed to add friend:",
        error
      );
      toast.error(
        isEditing
          ? "Arkadaş güncellenirken bir hata oluştu"
          : "Arkadaş eklenirken bir hata oluştu"
      );
    } finally {
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
        {isEditing ? (
          <UserCog className="text-primary h-5 w-5 mr-2" />
        ) : (
          <UserPlus className="text-primary h-5 w-5 mr-2" />
        )}
        <h2 className="text-lg font-medium">
          {isEditing ? "Arkadaşı Düzenle" : "Yeni Arkadaş Ekle"}
        </h2>
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
          {isSubmitting
            ? isEditing
              ? "Güncelleniyor..."
              : "Ekleniyor..."
            : isEditing
            ? "Arkadaşı Güncelle"
            : "Arkadaş Ekle"}
        </Button>
      </form>
    </motion.div>
  );
};

export default FriendForm;
