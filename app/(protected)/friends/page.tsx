"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  X,
  Settings,
  Edit,
  AlertTriangle,
} from "lucide-react";
import FriendCard from "@/app/components/FriendCard";
import FriendForm from "@/app/components/FriendForm";
import FirestoreIndexError from "@/app/components/FirestoreIndexError";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { useDebtStore } from "@/app/store/store";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FriendsManagement() {
  const {
    friends,
    isLoading,
    error,
    fetchFriends,
    fetchTransactions,
    addFriend,
    deleteFriend,
    getDebtSummaries,
  } = useDebtStore();

  const [showFriendForm, setShowFriendForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Initial data fetching
  useEffect(() => {
    fetchFriends();
    fetchTransactions();
  }, [fetchFriends, fetchTransactions]);

  const debtSummaries = getDebtSummaries();

  const toggleFriendForm = () => {
    setShowFriendForm(!showFriendForm);
  };

  const handleDeleteFriend = (id: string) => {
    const friend = friends.find((f) => f.id === id);
    if (friend) {
      setFriendToDelete({ id, name: friend.name });
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteFriend = () => {
    if (friendToDelete) {
      deleteFriend(friendToDelete.id)
        .then(() => {
          toast.success(`${friendToDelete.name} başarıyla silindi`);
          setDeleteDialogOpen(false);
          setFriendToDelete(null);
        })
        .catch((error) => {
          toast.error(`Silme işlemi başarısız: ${error.message}`);
        });
    }
  };

  if (isLoading && friends.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && friends.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-xl font-semibold text-danger-600 mb-4">
          Bir hata oluştu
        </h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button
          onClick={() => {
            fetchFriends();
            fetchTransactions();
          }}
        >
          Yeniden Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center text-foreground">
          <Users className="mr-2 h-7 w-7" />
          Arkadaşlar
        </h1>
        <Button onClick={toggleFriendForm}>
          {showFriendForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              İptal
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Arkadaş Ekle
            </>
          )}
        </Button>
      </div>

      <FirestoreIndexError />

      <AnimatePresence>
        {showFriendForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <Card className="border shadow-sm overflow-hidden">
              <CardContent className="p-5">
                <FriendForm
                  onAddFriend={(friend) => {
                    return addFriend(friend).then((newFriend) => {
                      setShowFriendForm(false);
                      toast.success("Arkadaş başarıyla eklendi");
                      return newFriend;
                    });
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          Arkadaş Yönetimi
        </h2>

        {debtSummaries.length === 0 ? (
          <Card className="bg-gradient-to-r from-gray-50 to-transparent p-6 text-center">
            <p className="text-muted-foreground mb-3">
              Henüz arkadaş eklenmemiş.
            </p>
            <Button
              onClick={() => setShowFriendForm(true)}
              size="sm"
              variant="outline"
              className="mx-auto"
            >
              <UserPlus className="mr-1 h-3.5 w-3.5" />
              Arkadaş Ekle
            </Button>
          </Card>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {debtSummaries.map((summary) => (
              <FriendCard
                key={summary.friendId}
                debtSummary={summary}
                onDelete={handleDeleteFriend}
                showControls={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Arkadaşı Sil
            </DialogTitle>
            <DialogDescription>
              Gerçekten{" "}
              <span className="font-semibold">{friendToDelete?.name}</span>{" "}
              silmek istiyor musunuz? Bu işlem geri alınamaz ve tüm işlem
              geçmişi de silinecektir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={confirmDeleteFriend}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
