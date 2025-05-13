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
  User,
  PenLine,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../utils/currency";

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
      const numAmount = parseFloat(amount);
      const result = await onAddTransaction({
        friendId,
        amount: numAmount,
        description,
        date: new Date().toISOString(),
        type,
      });

      // Reset form after successful submission
      resetForm();

      // Success notification with formatted currency
      const friendName =
        friends.find((f) => f.id === friendId)?.name || "Arkadaş";
      const typeText =
        type === "borrowed"
          ? "borç verdiniz"
          : type === "lent"
          ? "borç aldınız"
          : "ödeme yaptınız";
      toast.success(
        `${friendName}'a ${formatCurrency(numAmount, true)} ${typeText}`
      );
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
      color: "from-emerald-500 to-green-500",
      activeColor: "from-emerald-600 to-green-600",
      hoverColor: "hover:shadow-md hover:shadow-emerald-200",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      value: "lent",
      label: "Borç Aldım",
      icon: <ArrowUpFromLine className="h-4 w-4" />,
      color: "from-rose-500 to-red-500",
      activeColor: "from-rose-600 to-red-600",
      hoverColor: "hover:shadow-md hover:shadow-rose-200",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      value: "payment",
      label: "Ödeme",
      icon: <CreditCard className="h-4 w-4" />,
      color: "from-blue-500 to-indigo-500",
      activeColor: "from-blue-600 to-indigo-600",
      hoverColor: "hover:shadow-md hover:shadow-blue-200",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl bg-white border shadow-sm overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-20" />

      <div className="relative p-5 sm:p-6">
        <div className="mb-5 flex items-center border-b pb-4">
          <DollarSign className="text-primary h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Yeni İşlem Ekle
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1 text-gray-600">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              İşlem Tipi
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {transactionTypes.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value as Transaction["type"])}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  className={cn(
                    "relative overflow-hidden flex items-center justify-center py-2 px-3 rounded-lg border text-sm h-14 transition-all duration-200",
                    option.hoverColor,
                    type === option.value
                      ? cn(
                          `bg-gradient-to-r ${option.activeColor}`,
                          "text-white border-transparent"
                        )
                      : cn(
                          "border-gray-200",
                          option.bgColor,
                          "hover:border-gray-300"
                        )
                  )}
                >
                  {type === option.value && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-100`}
                    />
                  )}

                  <div className="relative z-10 flex items-center">
                    <div
                      className={cn(
                        "flex items-center justify-center mr-2 rounded-full w-8 h-8",
                        type === option.value
                          ? "bg-white/20 text-white"
                          : cn(option.iconColor)
                      )}
                    >
                      {option.icon}
                    </div>
                    <span
                      className={cn(
                        "font-medium",
                        type === option.value ? "text-white" : "text-gray-700"
                      )}
                    >
                      {option.label}
                    </span>
                  </div>

                  {type === option.value && (
                    <motion.div
                      className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="friend"
              className="text-sm font-medium flex items-center gap-1 text-gray-600"
            >
              <User className="h-3.5 w-3.5 text-primary" />
              Arkadaş
            </Label>
            <Select
              value={friendId}
              onValueChange={setFriendId}
              disabled={!!initialFriendId || isSubmitting}
            >
              <SelectTrigger className="w-full bg-white border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg h-11 shadow-sm">
                <SelectValue placeholder="Arkadaş seçin" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                <SelectGroup>
                  {friends.map((friend) => (
                    <SelectItem
                      key={friend.id}
                      value={friend.id}
                      className="cursor-pointer focus:bg-primary/10 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                        {friend.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="amount"
              className="text-sm font-medium flex items-center gap-1 text-gray-600"
            >
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Miktar (TL)
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                ₺
              </div>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 bg-white rounded-lg border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-11 shadow-sm"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
              {amount && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {formatCurrency(amount, true)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="description"
              className="text-sm font-medium flex items-center gap-1 text-gray-600"
            >
              <PenLine className="h-3.5 w-3.5 text-primary" />
              Açıklama (Opsiyonel)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="İşlem açıklaması..."
              className="resize-none h-24 bg-white rounded-lg border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full transition-all duration-300 relative overflow-hidden group",
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-primary-600 hover:shadow-lg hover:shadow-primary/20"
            )}
            disabled={isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  İşlemi Kaydet
                </>
              )}
            </span>
            <span
              className="absolute bottom-0 left-0 w-full h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform"
              style={{ transitionDuration: "350ms" }}
            />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default TransactionForm;
