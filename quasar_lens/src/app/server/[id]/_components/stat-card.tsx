import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
};

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <Icon className="text-primary h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
