import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { getTicket, assignTicket, updateTicketStatus } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ITicket, TicketStatus } from "../../interfaces/tickets";
import AgentPicker from "../../components/AgentPicker/AgentPicker";
import StatusPill from "../../components/Pills/StatusPill";
import PriorityPill from "../../components/Pills/PriorityPill";

const statuses: TicketStatus[] = ["Open", "InProgress", "Resolved"];
const StatusTextToNum: Record<TicketStatus, number> = { Open: 0, InProgress: 1, Resolved: 2 };

const TicketDetails: React.FC = () => {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: qk.ticket(id || ""),
    queryFn: () => getTicket(id || ""),
  });

  const assignMut = useMutation({
    mutationFn: ({ agentId }: { agentId: number | null }) => assignTicket(id!, { agentId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.ticket(id || "") });
      qc.invalidateQueries({ queryKey: qk.tickets() });
    },
  });

  const statusMut = useMutation({
    mutationFn: (next: TicketStatus) => updateTicketStatus(id!, { status: StatusTextToNum[next] }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.ticket(id || "") });
      qc.invalidateQueries({ queryKey: qk.tickets() });
    },
  });

  const t = data as ITicket | undefined;

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Ticket Details
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {isLoading && <Typography>Loading…</Typography>}
      {isError && <Typography color="error">Failed to load ticket.</Typography>}

      {t && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                      #{t.id}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t.title}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    <StatusPill value={t.status} />
                    <PriorityPill value={t.priority} />
                  </Stack>
                </Stack>

                <Divider />

                <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
                  {t.description || "No description."}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Status"
                  value={t.status}
                  onChange={(e) => statusMut.mutate(e.target.value as TicketStatus)}
                  size="small"
                  fullWidth
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>

                <AgentPicker
                  value={t.agentId ?? null}
                  onChange={(v) => assignMut.mutate({ agentId: v })}
                  sx={{ width: "100%" }}
                  label="Assign to agent"
                />

                <Divider />

                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {new Date(t.createdAt).toLocaleString()}
                  </Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Updated
                  </Typography>
                  <Typography variant="body2">
                    {new Date(t.updatedAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TicketDetails;
