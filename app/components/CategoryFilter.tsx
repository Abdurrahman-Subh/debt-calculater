"use client";

import { TransactionCategory } from "../types";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryFilterProps {
  selectedCategory: TransactionCategory | "all";
  onCategoryChange: (category: TransactionCategory | "all") => void;
}

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const categoryOptions: Array<{
    value: TransactionCategory | "all";
    label: string;
  }> = [
    { value: "all", label: "Tümü" },
    { value: "food", label: "Yemek" },
    { value: "entertainment", label: "Eğlence" },
    { value: "rent", label: "Kira" },
    { value: "transportation", label: "Ulaşım" },
    { value: "shopping", label: "Alışveriş" },
    { value: "utilities", label: "Faturalar" },
    { value: "healthcare", label: "Sağlık" },
    { value: "education", label: "Eğitim" },
    { value: "travel", label: "Seyahat" },
    { value: "other", label: "Diğer" },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-2 text-sm font-medium">Kategori Filtrele</div>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onCategoryChange(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryFilter;
