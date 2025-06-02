"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CategoryStats } from "../utils/statistics";
import { formatCurrency } from "../utils/currency";
import {
  Utensils,
  Music,
  Home,
  Bus,
  ShoppingBag,
  Lightbulb,
  Heart,
  GraduationCap,
  Plane,
  HelpCircle,
} from "lucide-react";

interface TopCategoriesCardsProps {
  data: CategoryStats[];
  limit?: number;
  transactionType?: "debt" | "expense";
}

const TopCategoriesCards = ({
  data,
  limit = 4,
  transactionType = "debt",
}: TopCategoriesCardsProps) => {
  // Only show categories with transactions, limited to the specified number
  const filteredData = data.filter((cat) => cat.count > 0).slice(0, limit);

  // Category icons
  const categoryIcons: Record<string, any> = {
    food: Utensils,
    entertainment: Music,
    rent: Home,
    transportation: Bus,
    shopping: ShoppingBag,
    utilities: Lightbulb,
    healthcare: Heart,
    education: GraduationCap,
    travel: Plane,
    other: HelpCircle,
  };

  // Category names in Turkish
  const categoryNames: Record<string, string> = {
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

  // Background colors for each category
  const categoryColors: Record<string, string> = {
    food: "bg-primary-50",
    entertainment: "bg-success-50",
    rent: "bg-destructive/10",
    transportation: "bg-accent-50",
    shopping: "bg-secondary-50",
    utilities: "bg-amber-50",
    healthcare: "bg-cyan-50",
    education: "bg-violet-50",
    travel: "bg-pink-50",
    other: "bg-gray-50",
  };

  // Icon colors for each category
  const iconColors: Record<string, string> = {
    food: "text-primary-600",
    entertainment: "text-success-600",
    rent: "text-destructive",
    transportation: "text-accent-600",
    shopping: "text-secondary-600",
    utilities: "text-amber-600",
    healthcare: "text-cyan-600",
    education: "text-violet-600",
    travel: "text-pink-600",
    other: "text-gray-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredData.length === 0 ? (
        <div className="col-span-full text-center py-4 text-muted-foreground">
          {transactionType === "expense"
            ? "Henüz harcama bulunmuyor."
            : "Henüz kategorili işlem bulunmuyor."}
        </div>
      ) : (
        filteredData.map((category) => {
          const Icon = categoryIcons[category.category] || HelpCircle;
          const bgColor = categoryColors[category.category] || "bg-gray-50";
          const iconColor = iconColors[category.category] || "text-gray-600";
          const name = categoryNames[category.category] || category.category;

          return (
            <Card key={category.category} className="overflow-hidden py-0">
              <CardContent className={`p-0 ${bgColor}`}>
                <div className="flex items-center p-4">
                  <div
                    className={`mr-4 p-2 rounded-full bg-white ${iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.count}{" "}
                      {transactionType === "expense" ? "harcama" : "işlem"}
                    </p>
                  </div>
                </div>
                <div className="bg-background p-4 border-t">
                  <div className="flex flex-col">
                    {transactionType === "debt" ? (
                      <>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Alacak:
                          </span>
                          <span className="text-sm text-success-600 font-medium">
                            {formatCurrency(category.borrowedAmount, false)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Borç:
                          </span>
                          <span className="text-sm text-destructive font-medium">
                            {formatCurrency(category.lentAmount, false)}
                          </span>
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between">
                          <span className="font-medium">Net:</span>
                          <span
                            className={`font-bold ${
                              category.totalAmount >= 0
                                ? "text-success-600"
                                : "text-destructive"
                            }`}
                          >
                            {formatCurrency(category.totalAmount, false)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="font-medium">Toplam Harcama:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(
                            Math.abs(category.totalAmount),
                            false
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default TopCategoriesCards;
