"use client";

import { useState, useEffect } from "react";
import useFirebaseStatus from "../hooks/useFirebaseStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function TestPage() {
  const { status, error, isConnected } = useFirebaseStatus();
  const [testResults, setTestResults] = useState<{
    friendsGet: boolean | null;
    friendsPost: boolean | null;
    transactionsGet: boolean | null;
    transactionsPost: boolean | null;
  }>({
    friendsGet: null,
    friendsPost: null,
    transactionsGet: null,
    transactionsPost: null,
  });
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults({
      friendsGet: null,
      friendsPost: null,
      transactionsGet: null,
      transactionsPost: null,
    });
    setTestMessage("Testler çalıştırılıyor...");

    try {
      // Test 1: GET friends
      setTestMessage("GET /api/friends testi yapılıyor...");
      const friendsRes = await fetch("/api/friends");
      const friendsTest = friendsRes.ok;
      setTestResults((prev) => ({ ...prev, friendsGet: friendsTest }));

      if (!friendsTest) {
        throw new Error("Friends API testi başarısız");
      }

      // Test 2: POST friends
      setTestMessage("POST /api/friends testi yapılıyor...");
      const testFriendName = `Test Arkadaş ${new Date().toISOString()}`;
      const friendPostRes = await fetch("/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: testFriendName }),
      });

      const friendPostTest = friendPostRes.ok;
      setTestResults((prev) => ({ ...prev, friendsPost: friendPostTest }));

      if (!friendPostTest) {
        throw new Error("Friend ekleme testi başarısız");
      }

      // Get the created friend for next test
      const newFriend = await friendPostRes.json();

      // Test 3: GET transactions
      setTestMessage("GET /api/transactions testi yapılıyor...");
      const transactionsRes = await fetch("/api/transactions");
      const transactionsTest = transactionsRes.ok;
      setTestResults((prev) => ({
        ...prev,
        transactionsGet: transactionsTest,
      }));

      if (!transactionsTest) {
        throw new Error("Transactions API testi başarısız");
      }

      // Test 4: POST transaction
      setTestMessage("POST /api/transactions testi yapılıyor...");
      const transactionPostRes = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendId: newFriend.id,
          amount: 10,
          type: "borrowed",
          description: "Test İşlem",
          date: new Date().toISOString(),
        }),
      });

      const transactionPostTest = transactionPostRes.ok;
      setTestResults((prev) => ({
        ...prev,
        transactionsPost: transactionPostTest,
      }));

      if (!transactionPostTest) {
        throw new Error("Transaction ekleme testi başarısız");
      }

      // Get created transaction
      const newTransaction = await transactionPostRes.json();

      // Clean up: delete the created transaction
      setTestMessage("Test işlemi siliniyor...");
      await fetch(`/api/transactions/${newTransaction.id}`, {
        method: "DELETE",
      });

      // Clean up: delete the created friend
      setTestMessage("Test arkadaşı siliniyor...");
      await fetch(`/api/friends/${newFriend.id}`, {
        method: "DELETE",
      });

      setTestMessage("Tüm testler başarıyla tamamlandı!");
      toast.success("API testleri başarılı!");
    } catch (err) {
      console.error("Test error:", err);
      setTestMessage(
        `Test hatası: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`
      );
      toast.error("Testler başarısız oldu.");
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null)
      return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    if (status) return <CheckCircle className="h-5 w-5 text-success-600" />;
    return <XCircle className="h-5 w-5 text-danger-600" />;
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Firebase & API Bağlantı Testi</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Firebase Durumu:
            {status === "checking" && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {status === "connected" && (
              <CheckCircle className="h-5 w-5 text-success-600" />
            )}
            {status === "error" && (
              <XCircle className="h-5 w-5 text-danger-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "checking" && (
            <p>Firebase bağlantısı kontrol ediliyor...</p>
          )}
          {status === "connected" && <p>Firebase bağlantısı başarılı!</p>}
          {status === "error" && (
            <div>
              <p className="text-danger-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Firebase bağlantı hatası:
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Testi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>GET /api/friends</span>
                {getStatusIcon(testResults.friendsGet)}
              </li>
              <li className="flex justify-between items-center">
                <span>POST /api/friends</span>
                {getStatusIcon(testResults.friendsPost)}
              </li>
              <li className="flex justify-between items-center">
                <span>GET /api/transactions</span>
                {getStatusIcon(testResults.transactionsGet)}
              </li>
              <li className="flex justify-between items-center">
                <span>POST /api/transactions</span>
                {getStatusIcon(testResults.transactionsPost)}
              </li>
            </ul>

            {testMessage && (
              <div className="text-sm text-muted-foreground mt-4">
                {testMessage}
              </div>
            )}

            <Button
              className="w-full"
              onClick={runTests}
              disabled={isRunningTests || !isConnected}
            >
              {isRunningTests ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testler Çalıştırılıyor...
                </>
              ) : (
                "API Testlerini Çalıştır"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
}
