import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorBoundaryProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-2">
        <p>{error.message}</p>
        <Button onClick={resetErrorBoundary} variant="outline" className="w-fit">
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}