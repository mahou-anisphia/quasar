import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type CrashesTableProps = {
  crashes: Array<{
    crashId: string;
    crashTime: Date;
    duration: bigint;
  }>;
};

export function CrashesTable({ crashes }: CrashesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <AlertTriangle className="h-4 w-4" />
            </TableHead>
            <TableHead>Crash Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Crash ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crashes.map((crash) => (
            <TableRow key={crash.crashId}>
              <TableCell>
                <div className="bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <AlertTriangle className="text-destructive h-4 w-4" />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {format(new Date(crash.crashTime), "PPpp")}
              </TableCell>
              <TableCell>{formatDuration(crash.duration)}</TableCell>
              <TableCell className="text-muted-foreground text-right font-mono text-xs">
                {crash.crashId.slice(0, 8)}...
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function formatDuration(seconds: bigint): string {
  const totalSeconds = Number(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
