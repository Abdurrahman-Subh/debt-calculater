"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryStats } from "../utils/statistics";
import { formatCurrency } from "../utils/currency";

interface CategoryStatsChartProps {
  data: CategoryStats[];
  transactionType?: "debt" | "expense";
}

const CategoryStatsChart = ({
  data,
  transactionType = "debt",
}: CategoryStatsChartProps) => {
  const [activeTab, setActiveTab] = useState<"pie" | "bar">("pie");

  // Category colors - align with your design system
  const CATEGORY_COLORS: Record<string, string> = {
    food: "var(--primary-500)",
    entertainment: "var(--success-500)",
    rent: "var(--danger-500)",
    transportation: "var(--accent-500)",
    shopping: "var(--secondary-500)",
    utilities: "#fbbf24", // Amber
    healthcare: "#06b6d4", // Cyan
    education: "#8b5cf6", // Violet
    travel: "#ec4899", // Pink
    other: "#9ca3af", // Gray
  };

  // Create formatted data for charts (only include non-zero categories)
  const chartData = data
    .filter((cat) => cat.count > 0)
    .map((cat) => ({
      name: formatCategoryName(cat.category),
      value: Math.abs(cat.totalAmount),
      borrowed: cat.borrowedAmount,
      lent: cat.lentAmount,
      category: cat.category,
    }));

  function formatCategoryName(category: string): string {
    const names: Record<string, string> = {
      food: "Yemek",
      entertainment: "Eğlence",
      rent: "Kira",
      transportation: "Ulaşım",
      shopping: "Alışveriş",
      utilities: "Faturalar",
      healthcare: "Sağlık",
      education: "Eğitim",
      travel: "Seyahat",
      other: "Diğer",
    };
    return names[category] || category;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">
            Toplam: {formatCurrency(Math.abs(data.value))}
          </p>
          {transactionType === "debt" ? (
            <>
              <p className="text-sm text-success-600">
                Alacak: {formatCurrency(data.borrowed)}
              </p>
              <p className="text-sm text-destructive">
                Borç: {formatCurrency(data.lent)}
              </p>
            </>
          ) : (
            <p className="text-sm text-primary">
              Harcama: {formatCurrency(data.value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-semibold">{payload[0].payload.name}</p>
          {transactionType === "debt" ? (
            payload.map((entry: any) => (
              <p
                key={entry.name}
                style={{ color: entry.color }}
                className="text-sm"
              >
                {entry.name === "Alacak" ? "Alacak" : "Borç"}:{" "}
                {formatCurrency(entry.value)}
              </p>
            ))
          ) : (
            <p className="text-sm text-primary">
              Harcama: {formatCurrency(payload[0].value)}
            </p>
          )}
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
            Kategoriye Göre İstatistikler
          </CardTitle>
          <div className="flex space-x-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setActiveTab("pie")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === "pie"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pasta Grafik
            </button>
            <button
              onClick={() => setActiveTab("bar")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === "bar"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Çubuk Grafik
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">
              Henüz kategorili işlem bulunmuyor.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {activeTab === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.other
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            ) : transactionType === "debt" ? (
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(value) => `${value} TL`} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend />
                <Bar
                  dataKey="borrowed"
                  name="Alacak"
                  fill="var(--success-500)"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="lent"
                  name="Borç"
                  fill="var(--danger-500)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            ) : (
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(value) => `${value} TL`} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Harcama"
                  fill="var(--primary-500)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryStatsChart;
