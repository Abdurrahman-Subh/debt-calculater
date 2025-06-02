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
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
  rent: {
    label: "Kira",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  transportation: {
    label: "Ulaşım",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  shopping: {
    label: "Alışveriş",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  utilities: {
    label: "Faturalar",
    color: "bg-sky-100 text-sky-700 border-sky-200",
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
