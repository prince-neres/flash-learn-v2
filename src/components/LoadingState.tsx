import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);
