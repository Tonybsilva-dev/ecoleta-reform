import { AlertCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  icon = <AlertCircleIcon className="h-8 w-8 text-red-500" />,
  title = "Ops!",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("py-8 text-center", className)}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        {icon}
      </div>
      <h3 className="mb-2 font-medium text-gray-900 text-lg">{title}</h3>
      <p className="mb-4 text-gray-500">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}
