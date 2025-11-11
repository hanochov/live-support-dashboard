import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { listTickets } from "../../services/api/ticketsApi";
import { assignTicket } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ITicket } from "../../interfaces/tickets";
import AgentPicker from "../../components/AgentPicker/AgentPicker";

const TicketsPage: React.FC = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: qk.tickets(), queryFn: () => listTickets() });

  const m = useMutation({
    mutationFn: ({ id, agentId }: { id: number; agentId: number | null }) => assignTicket(id, { agentId }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.tickets() });
      qc.invalidateQueries({ queryKey: qk.ticket(vars.id) });
    },
  });

  if (isLoading) return <Box p={3}><Typography>Loading...</Typography></Box>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Tickets</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Agent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data as ITicket[]).map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.id}</TableCell>
              <TableCell>{t.title}</TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell>{t.priority}</TableCell>
              <TableCell>
                <AgentPicker
                  value={t.agentId ?? null}
                  onChange={(v) => m.mutate({ id: t.id, agentId: v })}
                  sx={{ minWidth: 220 }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TicketsPage;
