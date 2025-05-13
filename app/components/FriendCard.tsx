"use client";

import { DebtSummary } from "../types";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trash2,
  ArrowRight,
  BanknoteIcon,
  PiggyBank,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FriendCardProps {
  debtSummary: DebtSummary;
  onDelete: (id: string) => void;
}

const FriendCard = ({ debtSummary, onDelete }: FriendCardProps) => {
  const { friendId, friendName, balance } = debtSummary;

  const handleDelete = () => {
    if (window.confirm(`Gerçekten ${friendName} silmek istiyor musunuz?`)) {
      onDelete(friendId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = `/friend/${friendId}`;
    }
  };

  // Determine color scheme based on balance
  const cardStyle = {
    borderColor:
      balance > 0
        ? "var(--success-500)"
        : balance < 0
        ? "var(--danger-500)"
        : "var(--border)",
    borderWidth: "2px",
    borderStyle: "solid",
    transition: "all 0.3s ease",
  };

  const bgGradient =
    balance > 0
      ? "bg-gradient-to-br from-success-50 to-background"
      : balance < 0
      ? "bg-gradient-to-br from-danger-50 to-background"
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      className="h-full"
    >
      <Card
        className={`h-full ${bgGradient} overflow-hidden`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={cardStyle}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center">
            <User className="h-5 w-5 mr-2 text-muted-foreground" />
            {friendName}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            aria-label={`${friendName} sil`}
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex items-center mt-2 mb-4">
            {balance > 0 ? (
              <div className="flex items-center w-full bg-success-100 rounded-lg p-4">
                <BanknoteIcon className="h-10 w-10 text-success-600 mr-3" />
                <div>
                  <p className="text-sm text-success-800">Alacak</p>
                  <p className="text-green-600 font-medium text-2xl">
                    {balance} <span className="text-sm">TL</span>
                  </p>
                </div>
              </div>
            ) : balance < 0 ? (
              <div className="flex items-center w-full bg-danger-100 rounded-lg p-4">
                <PiggyBank className="h-10 w-10 text-danger-600 mr-3" />
                <div>
                  <p className="text-sm text-danger-800">Borç</p>
                  <p className="text-danger-600 font-medium text-2xl">
                    {Math.abs(balance)} <span className="text-sm">TL</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center w-full bg-muted rounded-lg p-4">
                <User className="h-10 w-10 text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Durum</p>
                  <p className="text-muted-foreground font-medium">Borç yok</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full" asChild>
            <Link
              href={`/friend/${friendId}`}
              className="flex items-center justify-center"
            >
              Detayları Görüntüle <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FriendCard;
