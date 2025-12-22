import { Activity, Zap } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">
            Quasar Lens
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 animate-pulse" />
          <span>Auto-registers on first pulse</span>
        </div>
      </div>
    </header>
  );
}
