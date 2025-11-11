import React, { useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { listTickets } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ITicket } from "../../interfaces/tickets";

type Point = { date: string; count: number };

// yyyy-mm-dd
function toDayKey(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function rangeDays(start: Date, end: Date): string[] {
  const out: string[] = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cur <= last) {
    out.push(toDayKey(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

const DailyIssuesChart: React.FC = () => {
  const { data } = useQuery<ITicket[]>({
    queryKey: qk.tickets(),
    queryFn: () => listTickets(),
  });

  const points: Point[] = useMemo(() => {
    const items = data ?? [];
    if (items.length === 0) return [];

    let min = new Date(items[0].createdAt);
    let max = new Date(items[0].createdAt);

    const byDay = new Map<string, number>();
    for (const t of items) {
      const day = toDayKey(t.createdAt);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);

      const d = new Date(t.createdAt);
      if (d < min) min = d;
      if (d > max) max = d;
    }

    const days = rangeDays(min, max);
    return days.map((d) => ({ date: d, count: byDay.get(d) ?? 0 }));
  }, [data]);

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Daily total number of issues
      </Typography>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={points} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
              }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              tickMargin={8}
              allowDecimals={false}
            />
            <Tooltip
              labelFormatter={(v) => {
                const d = new Date(v);
                return d.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                });
              }}
              contentStyle={{ background: "#1e1f23", border: "1px solid #2b2d33", color: "#fff" }}
            />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.8)" }} />
            <Line
              type="monotone"
              dataKey="count"
              name="daily total number of issues"
              stroke="#f3c969"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default DailyIssuesChart;
