
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm" aria-live="polite" aria-busy="true">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
