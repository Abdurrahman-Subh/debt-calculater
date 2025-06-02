"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Banknote,
  CreditCard,
  Clock,
  CheckCircle,
  MinusCircle,
  Calendar,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { DebtDetail, Transaction } from "../types";
import { formatCurrency } from "../utils/currency";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PartialPaymentManagerProps {
  outstandingDebts: DebtDetail[];
  friendName: string;
  onMakePartialPayment: (
    debtId: string,
    amount: number,
    description?: string
  ) => Promise<void>;
}

const PartialPaymentManager = ({
  outstandingDebts,
  friendName,
  onMakePartialPayment,
}: PartialPaymentManagerProps) => {
  const [selectedDebt, setSelectedDebt] = useState<DebtDetail | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentClick = (debt: DebtDetail) => {
    setSelectedDebt(debt);
    setPaymentAmount("");
    setPaymentDescription("");
    setIsDialogOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedDebt) return;

    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Geçerli bir miktar girin");
      return;
    }

    if (amount > selectedDebt.remainingBalance) {
      toast.error("Ödeme miktarı kalan borçtan fazla olamaz");
      return;
    }

    setIsSubmitting(true);

    try {
      await onMakePartialPayment(
        selectedDebt.id,
        amount,
        paymentDescription || undefined
      );

      toast.success(
        `${formatCurrency(amount, true)} tutarında kısmi ödeme yapıldı`
      );
      setIsDialogOpen(false);
      setSelectedDebt(null);
      setPaymentAmount("");
      setPaymentDescription("");
    } catch (error) {
      console.error("Error making partial payment:", error);
      toast.error("Ödeme yapılırken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: tr });
  };

  const getDebtStatusColor = (debt: DebtDetail) => {
    if (debt.isFullyPaid) return "border-emerald-200 bg-emerald-50";
    if (debt.partialPayments.length > 0) return "border-amber-200 bg-amber-50";
    return "border-rose-200 bg-rose-50";
  };

  const getDebtStatusIcon = (debt: DebtDetail) => {
    if (debt.isFullyPaid)
      return <CheckCircle className="h-5 w-5 text-emerald-600" />;
    if (debt.partialPayments.length > 0)
      return <Clock className="h-5 w-5 text-amber-600" />;
    return <AlertCircle className="h-5 w-5 text-rose-600" />;
  };

  const getDebtStatusText = (debt: DebtDetail) => {
    if (debt.isFullyPaid) return "Ödendi";
    if (debt.partialPayments.length > 0) return "Kısmi Ödeme";
    return "Bekliyor";
  };

  if (outstandingDebts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tüm Borçlar Ödendi
          </h3>
          <p className="text-gray-500">
            {friendName} ile aranızda bekleyen borç bulunmuyor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Receipt className="h-5 w-5 mr-2 text-primary" />
          Bekleyen Borçlar
        </h3>
        <div className="text-sm text-gray-500">
          {outstandingDebts.filter((d) => !d.isFullyPaid).length} adet
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {outstandingDebts.map((debt) => (
            <motion.div
              key={debt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`${getDebtStatusColor(debt)} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getDebtStatusIcon(debt)}
                        <span className="text-sm font-medium text-gray-600">
                          {getDebtStatusText(debt)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(debt.createdDate)}
                        </span>
                      </div>

                      <h4 className="font-medium text-gray-900 mb-1">
                        {debt.originalTransaction.description || "Borç"}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Toplam Borç:</span>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(debt.originalAmount, true)}
                          </div>
                        </div>

                        {debt.partialPayments.length > 0 && (
                          <div>
                            <span className="text-gray-500">Ödenen:</span>
                            <div className="font-medium text-emerald-600">
                              {formatCurrency(
                                debt.originalAmount - debt.remainingBalance,
                                true
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-gray-500">Kalan:</span>
                          <div className="font-medium text-rose-600">
                            {formatCurrency(debt.remainingBalance, true)}
                          </div>
                        </div>
                      </div>

                      {debt.partialPayments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-xs text-gray-500 mb-1 block">
                            Ödeme Geçmişi ({debt.partialPayments.length} ödeme):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {debt.partialPayments
                              .slice(-3)
                              .map((payment, index) => (
                                <span
                                  key={payment.id}
                                  className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                                >
                                  {formatCurrency(payment.amount, true)}
                                </span>
                              ))}
                            {debt.partialPayments.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{debt.partialPayments.length - 3} daha
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {!debt.isFullyPaid && (
                      <Button
                        size="sm"
                        onClick={() => handlePaymentClick(debt)}
                        className="ml-4 flex items-center gap-1"
                      >
                        <CreditCard className="h-4 w-4" />
                        Ödeme Yap
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Kısmi Ödeme Yap
            </DialogTitle>
            <DialogDescription>
              {selectedDebt && (
                <>
                  <span className="font-medium">
                    {selectedDebt.originalTransaction.description || "Borç"}
                  </span>
                  <br />
                  Kalan borç:{" "}
                  {formatCurrency(selectedDebt.remainingBalance, true)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Ödeme Miktarı</Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedDebt?.remainingBalance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
              {selectedDebt &&
                paymentAmount &&
                parseFloat(paymentAmount) > selectedDebt.remainingBalance && (
                  <p className="text-sm text-red-600">
                    Ödeme miktarı kalan borçtan fazla olamaz
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDescription">
                Açıklama (isteğe bağlı)
              </Label>
              <Textarea
                id="paymentDescription"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                placeholder="Ödeme ile ilgili not..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleSubmitPayment}
              disabled={
                isSubmitting ||
                !paymentAmount ||
                parseFloat(paymentAmount) <= 0 ||
                (selectedDebt
                  ? parseFloat(paymentAmount) > selectedDebt.remainingBalance
                  : false)
              }
            >
              {isSubmitting ? "İşleniyor..." : "Ödeme Yap"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartialPaymentManager;
