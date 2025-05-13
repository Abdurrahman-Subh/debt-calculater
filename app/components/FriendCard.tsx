"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  ArrowUpRight,
  BanknoteIcon,
  PiggyBank,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../utils/currency";
import { DebtSummary } from "../types";

interface FriendCardProps {
  debtSummary: DebtSummary;
  onDelete?: (id: string) => void;
  showControls?: boolean;
}

export default function FriendCard({
  debtSummary,
  onDelete,
  showControls = false,
}: FriendCardProps) {
  const {
    friendId,
    friendName,
    balance,
    totalBorrowed,
    totalLent,
    totalPayments,
  } = debtSummary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border overflow-hidden h-full py-0">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">{friendName}</h3>
            </div>

            <div className="flex gap-1">
              {showControls && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(friendId)}
                  aria-label={`${friendName} sil`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link
                  href={`/friend/${friendId}`}
                  aria-label={`${friendName} detaylar`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "px-3 py-2 rounded-md mb-3 flex items-center gap-2",
              balance > 0
                ? "bg-green-50 text-green-700"
                : balance < 0
                ? "bg-red-50 text-red-700"
                : "bg-gray-50 text-gray-700"
            )}
          >
            {balance > 0 ? (
              <>
                <BanknoteIcon className="h-4 w-4" />
                <p className="text-sm font-medium">
                  <span className="font-bold">
                    {formatCurrency(balance, true)}
                  </span>{" "}
                  size borçlu
                </p>
              </>
            ) : balance < 0 ? (
              <>
                <PiggyBank className="h-4 w-4" />
                <p className="text-sm font-medium">
                  <span className="font-bold">
                    {formatCurrency(Math.abs(balance), true)}
                  </span>{" "}
                  borçlusunuz
                </p>
              </>
            ) : (
              <p className="text-sm font-medium">Borç yok</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {formatCurrency(totalBorrowed, true)}
              </span>
              <span>Verilen</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {formatCurrency(totalLent, true)}
              </span>
              <span>Alınan</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {formatCurrency(totalPayments, true)}
              </span>
              <span>Ödenen</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
