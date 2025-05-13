"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FriendMonthlyStats } from "../utils/statistics";
import { Button } from "@/components/ui/button";

interface FriendStatTableProps {
  data: FriendMonthlyStats[];
  monthName: string;
}

const FriendStatTable = ({ data, monthName }: FriendStatTableProps) => {
  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance)
    );
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Arkadaş Bazında Borç İstatistikleri ({monthName})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 px-2 text-left font-medium text-muted-foreground text-sm">
                  Arkadaş
                </th>
                <th className="pb-2 px-2 text-right font-medium text-muted-foreground text-sm">
                  Verilen
                </th>
                <th className="pb-2 px-2 text-right font-medium text-muted-foreground text-sm">
                  Alınan
                </th>
                <th className="pb-2 px-2 text-right font-medium text-muted-foreground text-sm">
                  Ödemeler
                </th>
                <th className="pb-2 px-2 text-right font-medium text-muted-foreground text-sm">
                  Net Bakiye
                </th>
                <th className="pb-2 px-2 text-right font-medium text-muted-foreground text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {monthName} ayında herhangi bir işlem bulunmuyor.
                  </td>
                </tr>
              ) : (
                sortedData.map((friend, index) => (
                  <motion.tr
                    key={friend.friendId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="py-3 px-2 text-foreground">
                      {friend.friendName}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-success-600">
                      {friend.totalBorrowed > 0
                        ? `${friend.totalBorrowed} TL`
                        : "-"}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-danger-600">
                      {friend.totalLent > 0 ? `${friend.totalLent} TL` : "-"}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-accent-600">
                      {friend.totalPayments > 0
                        ? `${friend.totalPayments} TL`
                        : "-"}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      <div className="flex items-center justify-end">
                        {friend.netBalance !== 0 &&
                          (friend.netBalance > 0 ? (
                            <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-danger-600 mr-1" />
                          ))}
                        <span
                          className={
                            friend.netBalance > 0
                              ? "text-success-600"
                              : friend.netBalance < 0
                              ? "text-danger-600"
                              : ""
                          }
                        >
                          {friend.netBalance !== 0
                            ? `${Math.abs(friend.netBalance)} TL`
                            : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/friend/${friend.friendId}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendStatTable;
