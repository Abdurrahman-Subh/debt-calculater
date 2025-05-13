"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Friend, Transaction } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  friends: Friend[];
  onAddTransaction: (
    transaction: Omit<Transaction, "id" | "userId">
  ) => Promise<Transaction>;
  initialFriendId?: string;
}

const TransactionForm = ({
  friends,
  onAddTransaction,
  initialFriendId,
}: TransactionFormProps) => {
  const [friendId, setFriendId] = useState(initialFriendId || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Transaction["type"]>("borrowed");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialFriendId) {
      setFriendId(initialFriendId);
    }
  }, [initialFriendId]);

  const resetForm = () => {
    if (!initialFriendId) {
      setFriendId("");
    }
    setAmount("");
    setDescription("");
    setType("borrowed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!friendId) {
      toast.error("Lütfen bir arkadaş seçin");
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Geçerli bir miktar giriniz");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onAddTransaction({
        friendId,
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString(),
        type,
      });

      // Reset form after successful submission
      resetForm();

      // Success notification
      const friendName =
        friends.find((f) => f.id === friendId)?.name || "Arkadaş";
      const typeText =
        type === "borrowed"
          ? "borç verdiniz"
          : type === "lent"
          ? "borç aldınız"
          : "ödeme yaptınız";
      toast.success(`${friendName}'a ${amount} TL ${typeText}`);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("İşlem kaydedilirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const transactionTypes = [
    {
      value: "borrowed",
      label: "Borç Verdim",
      icon: <ArrowDownToLine className="h-4 w-4" />,
    },
    {
      value: "lent",
      label: "Borç Aldım",
      icon: <ArrowUpFromLine className="h-4 w-4" />,
    },
    {
      value: "payment",
      label: "Ödeme",
      icon: <CreditCard className="h-4 w-4" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 flex items-center">
        <DollarSign className="text-primary h-5 w-5 mr-2" />
        <h2 className="text-lg font-medium">Yeni İşlem Ekle</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-500">İşlem Tipi</Label>
          <div className="grid grid-cols-3 gap-3">
            {transactionTypes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value as Transaction["type"])}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 rounded-md border text-sm h-14",
                  type === option.value
                    ? option.value === "borrowed"
                      ? "bg-secondary-50 border-secondary text-secondary-700 border-secondary-200"
                      : option.value === "lent"
                      ? "bg-danger-50 border-danger text-danger-700 border-danger-200"
                      : "bg-accent-50 border-accent text-accent-700 border-accent-200"
                    : "bg-white hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-center mb-1">
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full w-8 h-8",
                      type === option.value
                        ? option.value === "borrowed"
                          ? "bg-secondary-100 text-secondary-600"
                          : option.value === "lent"
                          ? "bg-danger-100 text-danger-600"
                          : "bg-accent-100 text-accent-600"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {option.icon}
                  </span>
                </div>
                <span className="whitespace-nowrap">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="friend" className="text-sm text-gray-500">
            Arkadaş
          </Label>
          <Select
            value={friendId}
            onValueChange={setFriendId}
            disabled={!!initialFriendId || isSubmitting}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Arkadaş seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {friends.map((friend) => (
                  <SelectItem key={friend.id} value={friend.id}>
                    {friend.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm text-gray-500">
            Miktar (TL)
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₺
            </div>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 bg-white"
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm text-gray-500">
            Açıklama (Opsiyonel)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="İşlem açıklaması..."
            className="resize-none h-24 bg-white"
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Kaydediliyor..." : "İşlemi Kaydet"}
        </Button>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
