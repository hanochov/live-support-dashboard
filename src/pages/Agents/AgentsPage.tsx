import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Toolbar,
  Divider,
  Chip,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAgents, createAgent } from "../../services/api/agentsApi";
import { listTickets } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ICreateAgentRequest, IAgent } from "../../interfaces/agents";
import type { ITicket } from "../../interfaces/tickets";
import { on } from "../../services/signalr/signalrService";

type SortField = "id" | "name" | "email" | "isActive" | "tickets";

function includes(hay: string | number | null | undefined, needle: string) {
  if (hay == null) return false;
  const s = String(hay).toLowerCase();
  return s.includes(needle);
}

function ActivePill({ active }: { active: boolean }) {
  const bg = active ? "rgba(34,197,94,0.22)" : "rgba(148,163,184,0.20)";
  const fg = active ? "#86efac" : "#cbd5e1";
  return (
    <Chip
      label={active ? "Active" : "Inactive"}
      size="small"
      sx={{ bgcolor: bg, color: fg, fontWeight: 600, borderRadius: 2, px: 1, height: 24, fontSize: 13 }}
    />
  );
}

const AgentsPage: React.FC = () => {
  const qc = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: agents, isLoading: isAgentsLoading } = useQuery({ queryKey: qk.agents(), queryFn: listAgents });
  const { data: tickets } = useQuery({ queryKey: qk.tickets(), queryFn: () => listTickets() });

  const [form, setForm] = useState<ICreateAgentRequest>({ name: "", email: "" });
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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
      if (t.agentId != null) map.set(t.agentId, (map.get(t.agentId) ?? 0) + 1);
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

  const filteredSorted = useMemo(() => {
    const list = (agents ?? []).filter((a) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      const ticketCount = countsByAgent.get(a.id) ?? 0;
      return (
        includes(a.id, q) ||
        includes(a.name, q) ||
        includes(a.email, q) ||
        includes(a.isActive ? "active" : "inactive", q) ||
        includes(ticketCount, q)
      );
    });

    const cmp = (a: IAgent, b: IAgent) => {
      let res = 0;
      if (sortField === "id") res = a.id - b.id;
      else if (sortField === "name") res = (a.name || "").localeCompare(b.name || "");
      else if (sortField === "email") res = (a.email || "").localeCompare(b.email || "");
      else if (sortField === "isActive") res = (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0);
      else if (sortField === "tickets") res = (countsByAgent.get(a.id) ?? 0) - (countsByAgent.get(b.id) ?? 0);
      return sortDir === "asc" ? res : -res;
    };

    return list.sort(cmp);
  }, [agents, countsByAgent, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortLabel: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort(field)}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      {sortField === field ? (sortDir === "asc" ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />) : null}
    </Stack>
  );

  const MobileCard: React.FC<{ a: IAgent }> = ({ a }) => {
    const ticketCount = countsByAgent.get(a.id) ?? 0;
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 2 }}>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={600}>{a.name}</Typography>
            <ActivePill active={a.isActive} />
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{a.email}</Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Chip label={`ID ${a.id}`} size="small" sx={{ borderRadius: 2 }} />
            <Chip label={`Tickets ${ticketCount}`} size="small" sx={{ borderRadius: 2 }} />
          </Stack>
        </Stack>
      </Paper>
    );
  };

  const hasFilters = search.trim() !== "";

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Agents</Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems="stretch"
        sx={{
          "& .MuiTextField-root, & .MuiButton-root": {
            height: 40,
          },
        }}
      >
        <TextField
          size="small"
          label="New agent name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          sx={{ width: { xs: "100%", sm: 220 } }}
        />
        <TextField
          size="small"
          label="New agent email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          sx={{ width: { xs: "100%", sm: 260 } }}
        />
        <Button
          variant="contained"
          onClick={() => m.mutate(form)}
          disabled={!form.name || !form.email || m.isPending}
          sx={{ width: { xs: "100%", sm: "auto" }, whiteSpace: "nowrap" }}
        >
          Create
        </Button>
      </Stack>

      <Toolbar
        disableGutters
        sx={{
          gap: 2,
          mb: 1,
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          size="small"
          label="Search agents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
        />

        {hasFilters && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setSearch("")}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Clear
          </Button>
        )}
      </Toolbar>

      <Divider sx={{ mb: 2 }} />

      {isAgentsLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Showing {filteredSorted.length} / {agents?.length ?? 0}
          </Typography>

          {isMobile ? (
            <Box>
              {filteredSorted.map((a) => (
                <MobileCard key={a.id} a={a} />
              ))}
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><SortLabel field="id" label="Id" /></TableCell>
                    <TableCell><SortLabel field="name" label="Name" /></TableCell>
                    <TableCell><SortLabel field="email" label="Email" /></TableCell>
                    <TableCell><SortLabel field="isActive" label="Active" /></TableCell>
                    <TableCell><SortLabel field="tickets" label="Tickets" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSorted.map((a) => {
                    const count = countsByAgent.get(a.id) ?? 0;
                    return (
                      <TableRow key={a.id} hover>
                        <TableCell>{a.id}</TableCell>
                        <TableCell>{a.name}</TableCell>
                        <TableCell>{a.email}</TableCell>
                        <TableCell><ActivePill active={a.isActive} /></TableCell>
                        <TableCell>{count}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AgentsPage;
