import React, { useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Toolbar,
  Divider,
  Button,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listTickets, assignTicket } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ITicket } from "../../interfaces/tickets";
import AgentPicker from "../../components/AgentPicker/AgentPicker";
import LiveStatus from "../../components/LiveStatus/LiveStatus";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectFilters } from "../../store/selectors";
import { useNavigate } from "react-router-dom";

import {
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setAgentFilter,
} from "../../store/uiSlice";

const TicketsPage: React.FC = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery<ITicket[]>({
    queryKey: ["tickets"] as const,
    queryFn: () => listTickets(),
  });

  const mutateAssign = useMutation({
    mutationFn: ({ id, agentId }: { id: number; agentId: number | null }) =>
      assignTicket(id, { agentId }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.tickets() });
      qc.invalidateQueries({ queryKey: qk.ticket(vars.id) });
    },
  });

  const filtered = useMemo(() => {
    const items = data as ITicket[];

    return items?.filter((t) => {
      if (filters.status !== "All" && t.status !== filters.status) return false;
      if (filters.priority !== "All" && t.priority !== filters.priority)
        return false;
      if (filters.agentId !== null) {
        const agentMatch =
          (t.agentId ?? null) === filters.agentId ||
          (filters.agentId === 0 &&
            (t.agentId === null || t.agentId === undefined));
        if (!agentMatch) return false;
      }
      if (filters.search.trim()) {
        const s = filters.search.trim().toLowerCase();
        const inTitle = t.title?.toLowerCase().includes(s);
        const inDesc = t.description?.toLowerCase().includes(s);
        const inAgent = (t.agentName ?? "").toLowerCase().includes(s);
        if (!inTitle && !inDesc && !inAgent) return false;
      }
      return true;
    });
  }, [data, filters]);

  return (
    <Box p={3}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h5">Tickets</Typography>
        <LiveStatus />
        <Button variant="contained" onClick={() => navigate("/tickets/new")}>
          New Ticket
        </Button>
      </Stack>

      <Toolbar disableGutters sx={{ gap: 2, mb: 1, flexWrap: "wrap" }}>
        <TextField
          size="small"
          label="Search"
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />

        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="InProgress">InProgress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={filters.priority}
            onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </Select>
        </FormControl>

        <AgentPicker
          value={filters.agentId}
          onChange={(v) => dispatch(setAgentFilter(v))}
          sx={{ minWidth: 240 }}
          label="Filter by Agent"
        />
      </Toolbar>

      <Divider sx={{ mb: 2 }} />

      {isLoading && <Typography>Loading…</Typography>}
      {isError && (
        <Typography color="error">Failed to load tickets.</Typography>
      )}

      {!isLoading && !isError && (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Showing {filtered.length} / {data?.length ?? 0}
          </Typography>

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
              {filtered.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.priority}</TableCell>
                  <TableCell>
                    <AgentPicker
                      value={t.agentId ?? null}
                      onChange={(v) =>
                        mutateAssign.mutate({ id: t.id, agentId: v })
                      }
                      sx={{ minWidth: 220 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default TicketsPage;
