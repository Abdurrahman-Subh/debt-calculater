"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyStats } from "../utils/statistics";

interface MonthlyBalanceChartProps {
  data: MonthlyStats[];
}

const MonthlyBalanceChart = ({ data }: MonthlyBalanceChartProps) => {
  const [activeTab, setActiveTab] = useState<"balance" | "details">("balance");

  // Format the data for the charts
  const chartData = data.slice(0).reverse(); // Reverse to show oldest to newest

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any) => (
            <p
              key={entry.name}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {entry.value.toFixed(2)} TL
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Aylık Borç Durumu
          </CardTitle>
          <div className="flex space-x-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setActiveTab("balance")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === "balance"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Net Bakiye
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === "details"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Detaylı Görünüm
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          {activeTab === "balance" ? (
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tickFormatter={(value) => `${value} TL`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="netBalance"
                name="Net Bakiye"
                fill="var(--primary-500)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="netBalance"
                name="Trend"
                stroke="var(--accent-500)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tickFormatter={(value) => `${value} TL`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="totalBorrowed"
                name="Verilen Borç"
                fill="var(--success-500)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalLent"
                name="Alınan Borç"
                fill="var(--danger-500)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalPayments"
                name="Ödemeler"
                fill="var(--accent-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyBalanceChart;
