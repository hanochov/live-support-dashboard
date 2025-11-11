import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box, Stack, Typography, Divider, TextField, MenuItem
} from "@mui/material";
import { getTicket, assignTicket, updateTicketStatus } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ITicket, TicketStatus } from "../../interfaces/tickets";
import AgentPicker from "../../components/AgentPicker/AgentPicker";
import LiveStatus from "../../components/LiveStatus/LiveStatus";

const statuses: TicketStatus[] = ["Open", "InProgress", "Resolved"];
const StatusTextToNum: Record<TicketStatus, number> = { Open: 0, InProgress: 1, Resolved: 2 };

const TicketDetails: React.FC = () => {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: qk.ticket(id || ""),
    queryFn: () => getTicket(id || "")
  });

  const assignMut = useMutation({
    mutationFn: ({ agentId }: { agentId: number | null }) => assignTicket(id!, { agentId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.ticket(id || "") });
      qc.invalidateQueries({ queryKey: qk.tickets() });
    }
  });

  const statusMut = useMutation({
    mutationFn: (next: TicketStatus) =>
      updateTicketStatus(id!, { status: StatusTextToNum[next] }),
    onSuccess: () => {
      // אם יש SignalR שמפרסם TicketStatusChanged, זה יתעדכן גם לבד.
      qc.invalidateQueries({ queryKey: qk.ticket(id || "") });
      qc.invalidateQueries({ queryKey: qk.tickets() });
    }
  });

  const t = data as ITicket | undefined;

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Ticket Details</Typography>
        <LiveStatus />
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">Failed to load ticket.</Typography>}

      {t && (
        <Stack spacing={2}>
          <Typography>ID: {t.id}</Typography>
          <Typography>Title: {t.title}</Typography>

          <TextField
            select
            label="Status"
            value={t.status}
            onChange={(e) => statusMut.mutate(e.target.value as TicketStatus)}
            sx={{ maxWidth: 260 }}
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>

          <Typography>Priority: {t.priority}</Typography>

          <AgentPicker
            value={t.agentId ?? null}
            onChange={(v) => assignMut.mutate({ agentId: v })}
            sx={{ maxWidth: 260 }}
          />

          <Typography>Description: {t.description}</Typography>
        </Stack>
      )}
    </Box>
  );
};

export default TicketDetails;
