"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareHelpCard() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showOnStartup, setShowOnStartup] = useState(true);

  // Check if the user has seen this help before
  useState(() => {
    const hasSeenHelp = localStorage.getItem("hasSeenShareHelp");
    if (hasSeenHelp) {
      setShowOnStartup(false);
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("hasSeenShareHelp", "true");
  };

  if (isDismissed || !showOnStartup) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="mb-6"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                <Share className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">
                  Yeni Özellik: Borç Paylaşımı
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Artık arkadaşlarınızla borç durumunu ve işlemleri
                  paylaşabilirsiniz. Her arkadaş ve işlem sayfasında "Paylaş"
                  düğmesini kullanarak bir link oluşturabilirsiniz.
                </p>
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDismiss}
                    className="flex items-center"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Anladım
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-muted-foreground"
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Gizle
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
