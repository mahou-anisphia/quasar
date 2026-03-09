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
    <div className="rounded-md border" style={{ borderColor: "rgba(192,38,211,0.15)" }}>
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: "rgba(192,38,211,0.12)" }}>
            <TableHead className="w-15" />
            <TableHead>
              <span className="font-caveat" style={{ color: "rgba(74,26,46,0.45)", fontSize: "0.88rem" }}>
                when it died
              </span>
            </TableHead>
            <TableHead>
              <span className="font-caveat" style={{ color: "rgba(74,26,46,0.45)", fontSize: "0.88rem" }}>
                how long
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="font-caveat" style={{ color: "rgba(74,26,46,0.45)", fontSize: "0.88rem" }}>
                crash id
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crashes.map((crash) => (
            <TableRow key={crash.crashId} style={{ borderColor: "rgba(192,38,211,0.08)" }}>
              <TableCell>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,77,109,0.08)" }}
                >
                  <AlertTriangle className="h-4 w-4" style={{ color: "var(--q-hot)" }} />
                </div>
              </TableCell>
              <TableCell>
                <span className="font-jost text-sm" style={{ color: "var(--q-mid)" }}>
                  {format(new Date(crash.crashTime), "PPpp")}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className="font-caveat"
                  style={{ color: "var(--q-hot)", fontSize: "1rem", fontWeight: 600 }}
                >
                  {formatDuration(crash.duration)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--q-purple)", opacity: 0.6 }}
                >
                  {crash.crashId.slice(0, 8)}…
                </span>
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
