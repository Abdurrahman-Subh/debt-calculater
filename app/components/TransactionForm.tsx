"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Friend, Transaction, TransactionCategory } from "../types";
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
  TagIcon,
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

// Category configuration with colors and icons
const categoryConfig = {
  food: {
    label: "Yemek",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  entertainment: {
    label: "Eğlence",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  rent: { label: "Kira", color: "bg-blue-100 text-blue-700 border-blue-200" },
  transportation: {
    label: "Ulaşım",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  shopping: {
    label: "Alışveriş",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  utilities: {
    label: "Faturalar",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  healthcare: {
    label: "Sağlık",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  education: {
    label: "Eğitim",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  travel: {
    label: "Seyahat",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
  other: { label: "Diğer", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

const TransactionForm = ({
  friends,
  onAddTransaction,
  initialFriendId,
}: TransactionFormProps) => {
  const [friendId, setFriendId] = useState(initialFriendId || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Transaction["type"]>("borrowed");
  const [category, setCategory] = useState<TransactionCategory>("other");
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
    setCategory("other");
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
        category,
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
                        "rounded-full p-1.5",
                        type === option.value
                          ? "bg-white/20"
                          : option.iconColor,
                        "mr-2"
                      )}
                    >
                      {option.icon}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="friend"
                className="text-sm font-medium flex items-center gap-1 text-gray-600"
              >
                <User className="h-3.5 w-3.5 text-primary" />
                Arkadaş
              </Label>
              {friends.length > 0 ? (
                <Select
                  value={friendId}
                  onValueChange={setFriendId}
                  disabled={isSubmitting || !!initialFriendId}
                >
                  <SelectTrigger
                    id="friend"
                    className="w-full border-gray-200 focus:ring-primary"
                  >
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
              ) : (
                <div className="text-sm text-muted-foreground border rounded-md p-2 bg-muted">
                  Önce arkadaş eklemeniz gerekiyor
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-sm font-medium flex items-center gap-1 text-gray-600"
              >
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Miktar (TL)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-gray-200 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium flex items-center gap-1 text-gray-600"
            >
              <TagIcon className="h-3.5 w-3.5 text-primary" />
              Kategori
            </Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as TransactionCategory)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="category"
                className="w-full border-gray-200 focus:ring-primary"
              >
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(categoryConfig).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            categoryConfig[
                              key as TransactionCategory
                            ].color.split(" ")[0]
                          }`}
                        />
                        <span className="ml-2">{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium flex items-center gap-1 text-gray-600"
            >
              <PenLine className="h-3.5 w-3.5 text-primary" />
              Açıklama (Opsiyonel)
            </Label>
            <Textarea
              id="description"
              placeholder="Açıklama ekleyin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 text-sm border-gray-200 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !friendId || !amount}
            className="w-full"
          >
            {isSubmitting ? "Kaydediliyor..." : "İşlemi Kaydet"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default TransactionForm;
