import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Carregando...",
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
}
