import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
      </div>
      <p className="mt-6 text-muted-foreground font-serif italic animate-pulse">
        Đang tải bảng giá & các gói thuê...
      </p>
    </div>
  );
}
