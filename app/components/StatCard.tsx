"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  color?: "primary" | "secondary" | "accent" | "success" | "danger" | "warning";
  change?: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color = "primary",
  change,
}: StatCardProps) => {
  const iconColorClasses = {
    primary: "bg-primary-100 text-primary-700",
    secondary: "bg-secondary-100 text-secondary-700",
    accent: "bg-accent-100 text-accent-700",
    success: "bg-success-100 text-success-700",
    danger: "bg-danger-100 text-danger-700",
    warning: "bg-warning-100 text-warning-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card
        className="h-full overflow-hidden border-t-4"
        style={{ borderTopColor: `var(--${color}-500)` }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2.5 rounded-full ${iconColorClasses[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  change >= 0 ? "text-success-600" : "text-danger-600"
                }`}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                son ay ile karşılaştırma
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
