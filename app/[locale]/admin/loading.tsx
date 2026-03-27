import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl">
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="absolute inset-0 bg-primary/20 blur-lg animate-pulse rounded-full" />
      </div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse text-sm">
        Đang chuẩn bị bảng điều khiển...
      </p>
    </div>
  );
}
