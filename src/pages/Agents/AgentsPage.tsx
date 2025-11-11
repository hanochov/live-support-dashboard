import React, { useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { listAgents, createAgent } from "../../services/api/agentsApi";
import { listTickets } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ICreateAgentRequest } from "../../interfaces/agents";
import type { ITicket } from "../../interfaces/tickets";
import { on } from "../../services/signalr/signalrService";

const AgentsPage: React.FC = () => {
  const qc = useQueryClient();

  const { data: agents, isLoading: isAgentsLoading } =
    useQuery({ queryKey: qk.agents(), queryFn: listAgents });

  const { data: tickets } =
    useQuery({ queryKey: qk.tickets(), queryFn: () => listTickets() });

  const [form, setForm] = React.useState<ICreateAgentRequest>({ name: "", email: "" });

  const m = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.agents() });
      setForm({ name: "", email: "" });
    },
  });

  const countsByAgent = useMemo(() => {
    const map = new Map<number, number>();
    (tickets ?? []).forEach((t: ITicket) => {
      if (t.agentId != null) {
        map.set(t.agentId, (map.get(t.agentId) ?? 0) + 1);
      }
    });
    return map;
  }, [tickets]);

  useEffect(() => {
    const unsubCreate = on("TicketCreated", () => qc.invalidateQueries({ queryKey: qk.tickets() }));
    const unsubUpdate = on("TicketUpdated", () => qc.invalidateQueries({ queryKey: qk.tickets() }));
    const unsubStatus = on("TicketStatusChanged", () => qc.invalidateQueries({ queryKey: qk.tickets() }));
    const unsubDelete = on("TicketDeleted", () => qc.invalidateQueries({ queryKey: qk.tickets() }));
    return () => {
      unsubCreate(); unsubUpdate(); unsubStatus(); unsubDelete();
    };
  }, [qc]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Agents</Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          size="small"
          label="Name"
          value={form.name}
          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <TextField
          size="small"
          label="Email"
          value={form.email}
          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <Button
          variant="contained"
          onClick={() => m.mutate(form)}
          disabled={!form.name || !form.email || m.isPending}
        >
          Create
        </Button>
      </Stack>

      {isAgentsLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Tickets</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(agents ?? []).map(a => (
              <TableRow key={a.id}>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>{countsByAgent.get(a.id) ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default AgentsPage;
