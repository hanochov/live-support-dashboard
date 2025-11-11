import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { listAgents, createAgent } from "../../services/api/agentsApi";
import { qk } from "../../services/api/queryKeys";
import type { ICreateAgentRequest } from "../../interfaces/agents";

const AgentsPage: React.FC = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: qk.agents(), queryFn: listAgents });

  const [form, setForm] = useState<ICreateAgentRequest>({ name: "", email: "" });

  const m = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.agents() });
      setForm({ name: "", email: "" });
    },
  });

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

      {isLoading ? (
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
            {(data ?? []).map(a => (
              <TableRow key={a.id}>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>{a.ticketIds.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default AgentsPage;
