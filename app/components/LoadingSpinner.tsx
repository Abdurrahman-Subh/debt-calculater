import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  showText?: boolean;
}

const LoadingSpinner = ({
  className,
  showText = true,
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={cn("h-8 w-8 animate-spin text-primary", className)} />
      {showText && (
        <p className="mt-2 text-sm text-muted-foreground">Yükleniyor...</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
