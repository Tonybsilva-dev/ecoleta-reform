import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "./button";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Algo deu errado",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircleIcon className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-2 font-medium text-gray-900 text-lg">Ops!</h3>
      <p className="mb-4 text-gray-500">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`}></div>
  );
}

export function ItemDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-3">
              <Skeleton className="mb-2 h-3 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
