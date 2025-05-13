"use client";

import { useDebtStore } from "@/app/store/store";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FirestoreIndexError() {
  const { error, indexUrl, clearError } = useDebtStore();

  if (!error || !indexUrl) return null;

  const handleCreateIndex = () => {
    window.open(indexUrl, "_blank");
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Firestore İndeksi Gerekli</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-2">
        <p>{error}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={handleCreateIndex}>
            İndeks Oluştur
          </Button>
          <Button size="sm" variant="ghost" onClick={clearError}>
            Kapat
          </Button>
        </div>
        <p className="text-xs mt-2">
          İndeks oluşturduktan sonra, işlemlerin çalışması için birkaç dakika
          beklemeniz gerekebilir.
        </p>
      </AlertDescription>
    </Alert>
  );
}

export default FirestoreIndexError;
