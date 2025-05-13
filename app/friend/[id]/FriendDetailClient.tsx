"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  BanknoteIcon,
  PiggyBank,
  User,
} from "lucide-react";
import TransactionList from "../../components/TransactionList";
import TransactionForm from "../../components/TransactionForm";
import FirestoreIndexError from "../../components/FirestoreIndexError";
import { useDebtStore } from "../../store/store";
import { DebtSummary } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

interface FriendDetailClientProps {
  friendId: string;
}

export default function FriendDetailClient({
  friendId,
}: FriendDetailClientProps) {
  const router = useRouter();
  const {
    friends,
    addTransaction,
    deleteTransaction,
    deleteFriend,
    getTransactionsForFriend,
    getDebtSummaries,
  } = useDebtStore();

  const [friendSummary, setFriendSummary] = useState<DebtSummary | null>(null);
  const [transactions, setTransactions] = useState<
    ReturnType<typeof getTransactionsForFriend>
  >([]);

  useEffect(() => {
    // Find the friend
    const summary = getDebtSummaries().find((s) => s.friendId === friendId);
    if (!summary) {
      router.push("/");
      return;
    }

    setFriendSummary(summary);
    setTransactions(getTransactionsForFriend(friendId));
  }, [friendId, friends, getDebtSummaries, getTransactionsForFriend, router]);

  if (!friendSummary) {
    return null; // Will redirect in the useEffect
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Gerçekten ${friendSummary.friendName} silmek istiyor musunuz? Tüm işlem geçmişi de silinecektir.`
      )
    ) {
      deleteFriend(friendSummary.friendId);
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 p-4"
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/" aria-label="Ana sayfaya dön">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center text-foreground">
          <User className="mr-2 h-6 w-6" />
          {friendSummary.friendName}
        </h1>
      </div>

      <FirestoreIndexError />

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Borç Durumu
              </h2>
              <div className="flex items-center space-x-2">
                {friendSummary.balance > 0 ? (
                  <>
                    <BanknoteIcon className="h-5 w-5 text-green-600" />
                    <p className="text-green-600 font-medium text-lg">
                      {friendSummary.friendName} size{" "}
                      <span className="font-bold">
                        {friendSummary.balance} TL
                      </span>{" "}
                      borçlu
                    </p>
                  </>
                ) : friendSummary.balance < 0 ? (
                  <>
                    <PiggyBank className="h-5 w-5 text-red-500" />
                    <p className="text-red-600 font-medium text-lg">
                      Siz {friendSummary.friendName}'a{" "}
                      <span className="font-bold">
                        {Math.abs(friendSummary.balance)} TL
                      </span>{" "}
                      borçlusunuz
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground font-medium">Borç yok</p>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              aria-label={`${friendSummary.friendName} sil`}
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <TransactionForm
        friends={friends}
        onAddTransaction={addTransaction}
        initialFriendId={friendSummary.friendId}
      />

      <div className="mt-2">
        <TransactionList
          transactions={transactions}
          friends={friends}
          onDeleteTransaction={deleteTransaction}
        />
      </div>

      <Toaster />
    </motion.div>
  );
}
