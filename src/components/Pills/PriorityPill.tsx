import { Chip } from "@mui/material";
import type { TicketPriority } from "../../interfaces/tickets";

const palette: Record<TicketPriority, { bg: string; fg: string }> = {
  Low:      { bg: "rgba(110,231,255,0.18)", fg: "#7dd3fc" },
  Medium:   { bg: "rgba(99,102,241,0.20)",  fg: "#a5b4fc" },
  High:     { bg: "rgba(245,158,11,0.22)",  fg: "#fbbf24" },
  Critical: { bg: "rgba(239,68,68,0.22)",   fg: "#f87171" },
};

export default function PriorityPill({ value }: { value: TicketPriority }) {
  const c = palette[value] ?? palette.Low;
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.fg,
        fontWeight: 600,
        borderRadius: 999,
        px: 1
      }}
    />
  );
}
