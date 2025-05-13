import { TransactionCategory } from "../types";

// Category configuration with colors and icons
export const categoryConfig: Record<
  TransactionCategory,
  {
    label: string;
    color: string;
  }
> = {
  food: {
    label: "Yemek",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  entertainment: {
    label: "Eğlence",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  rent: {
    label: "Kira",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  transportation: {
    label: "Ulaşım",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  shopping: {
    label: "Alışveriş",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  utilities: {
    label: "Faturalar",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  healthcare: {
    label: "Sağlık",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  education: {
    label: "Eğitim",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  travel: {
    label: "Seyahat",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
  other: {
    label: "Diğer",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
};
