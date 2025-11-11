import { Chip } from "@mui/material";
import type { TicketStatus } from "../../interfaces/tickets";

const palette: Record<TicketStatus, { bg: string; fg: string }> = {
  Open:       { bg: "rgba(56,189,248,0.20)", fg: "#7dd3fc" },
  InProgress: { bg: "rgba(168,85,247,0.22)", fg: "#c4b5fd" },
  Resolved:   { bg: "rgba(34,197,94,0.22)",  fg: "#86efac" },
};

export default function StatusPill({ value }: { value: TicketStatus }) {
  const c = palette[value] ?? palette.Open;
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
