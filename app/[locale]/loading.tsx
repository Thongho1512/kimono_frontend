import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse tracking-wide uppercase">
        Đang tải...
      </p>
    </div>
  );
}
