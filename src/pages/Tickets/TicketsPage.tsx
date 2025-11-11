import React, { useMemo, useState } from "react";
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
  IconButton,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useQuery } from "@tanstack/react-query";
import { listTickets } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type {
  ITicket,
  TicketPriority,
  TicketStatus,
} from "../../interfaces/tickets";
import AgentPicker from "../../components/AgentPicker/AgentPicker";
import AgentLabel from "../../components/AgentLabel/AgentLabel";
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
import PriorityPill from "../../components/Pills/PriorityPill";
import StatusPill from "../../components/Pills/StatusPill";

type SortField = "id" | "title" | "status" | "priority" | "agentName";
type SortDir = "asc" | "desc";

const statusOrder: Record<TicketStatus, number> = {
  Open: 0,
  InProgress: 1,
  Resolved: 2,
};

const priorityOrder: Record<TicketPriority, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
};

function includes(hay: string | number | null | undefined, needle: string) {
  if (hay == null) return false;
  const s = String(hay).toLowerCase();
  return s.includes(needle);
}

const TicketsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<ITicket[]>({
    queryKey: qk.tickets(),
    queryFn: () => listTickets(),
  });

  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredSorted = useMemo(() => {
    const items = (data ?? []) as ITicket[];

    const passFilters = (t: ITicket) => {
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
        const q = filters.search.trim().toLowerCase();
        const hit =
          includes(t.id, q) ||
          includes(t.title, q) ||
          includes(t.description, q) ||
          includes(t.status, q) ||
          includes(t.priority, q) ||
          includes(t.agentName, q);
        if (!hit) return false;
      }
      return true;
    };

    const list = items.filter(passFilters);

    const cmp = (a: ITicket, b: ITicket) => {
      let res = 0;
      if (sortField === "id") res = a.id - b.id;
      else if (sortField === "title")
        res = (a.title || "").localeCompare(b.title || "");
      else if (sortField === "status")
        res = statusOrder[a.status] - statusOrder[b.status];
      else if (sortField === "priority")
        res = priorityOrder[a.priority] - priorityOrder[b.priority];
      else if (sortField === "agentName")
        res = (a.agentName || "").localeCompare(b.agentName || "");
      return sortDir === "asc" ? res : -res;
    };

    return list.sort(cmp);
  }, [data, filters, sortField, sortDir]);

  const handleRowClick = (id: number) => {
    navigate(`/tickets/${id}`);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortLabel: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ cursor: "pointer", userSelect: "none" }}
      onClick={() => toggleSort(field)}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      {sortField === field ? (
        sortDir === "asc" ? (
          <ArrowDropUpIcon fontSize="small" />
        ) : (
          <ArrowDropDownIcon fontSize="small" />
        )
      ) : null}
    </Stack>
  );

  const MobileCard: React.FC<{ t: ITicket }> = ({ t }) => (
    <Paper
      variant="outlined"
      onClick={() => handleRowClick(t.id)}
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {t.title}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tickets/${t.id}`);
            }}
          >
            <EditOutlinedIcon  fontSize="small" />
          </IconButton>
        </Stack>

        {t.description ? (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {t.description.length > 120
              ? t.description.slice(0, 120) + "…"
              : t.description}
          </Typography>
        ) : null}

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Chip label={`#${t.id}`} size="small" sx={{ borderRadius: 2 }} />
          <StatusPill value={t.status} />
          <PriorityPill value={t.priority} />
          <AgentLabel agentId={t.agentId ?? null} />
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <Box p={3}>
    <Stack
  direction="row"
  alignItems="center"
  justifyContent="space-between"
  flexWrap="wrap"
  mb={2}
  gap={2}
>
  <Typography variant="h5" sx={{ fontWeight: 600 }}>
    Tickets
  </Typography>

  <Stack direction="row" alignItems="center" gap={2}>
    <Button
      variant="contained"
      onClick={() => navigate("/tickets/new")}
      sx={{ whiteSpace: "nowrap" }}
    >
      New Ticket
    </Button>
  </Stack>
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
    label="Search all"
    value={filters.search}
    onChange={(e) => dispatch(setSearch(e.target.value))}
    sx={{ width: { xs: "100%", sm: 260 } }}
  />

  <FormControl size="small" sx={{ width: { xs: "100%", sm: 180 } }}>
    <InputLabel>Status</InputLabel>
    <Select
      label="Status"
      value={filters.status}
      onChange={(e) => dispatch(setStatusFilter(e.target.value as TicketStatus))}
    >
      <MenuItem value="All">All</MenuItem>
      <MenuItem value="Open">Open</MenuItem>
      <MenuItem value="InProgress">InProgress</MenuItem>
      <MenuItem value="Resolved">Resolved</MenuItem>
    </Select>
  </FormControl>

  <FormControl size="small" sx={{ width: { xs: "100%", sm: 180 } }}>
    <InputLabel>Priority</InputLabel>
    <Select
      label="Priority"
      value={filters.priority}
      onChange={(e) => dispatch(setPriorityFilter(e.target.value as TicketPriority))}
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
    sx={{ width: { xs: "100%", sm: 240 } }}
    label="Filter by Agent"
  />

  {(filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.search.trim() !== "" ||
    filters.agentId !== null) && (
    <Button
      variant="outlined"
      color="inherit"
      onClick={() => {
        dispatch(setSearch(""));
        dispatch(setStatusFilter("All" as TicketStatus));
        dispatch(setPriorityFilter("All" as TicketPriority));
        dispatch(setAgentFilter(null));
      }}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      Clear Filters
    </Button>
  )}
</Toolbar>


      <Divider sx={{ mb: 2 }} />

      {isLoading && <Typography>Loading…</Typography>}
      {isError && (
        <Typography color="error">Failed to load tickets.</Typography>
      )}

      {!isLoading && !isError && (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Showing {filteredSorted.length} / {data?.length ?? 0}
          </Typography>

          {isMobile ? (
            <Box>
              {filteredSorted.map((t) => (
                <MobileCard key={t.id} t={t} />
              ))}
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <SortLabel field="id" label="Ticket ID" />
                    </TableCell>
                    <TableCell>
                      <SortLabel field="title" label="Title" />
                    </TableCell>
                    <TableCell>
                      <SortLabel field="status" label="Status" />
                    </TableCell>
                    <TableCell>
                      <SortLabel field="priority" label="Priority" />
                    </TableCell>
                    <TableCell>
                      <SortLabel field="agentName" label="Agent" />
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredSorted.map((t) => (
                    <TableRow
                      key={t.id}
                      hover
                      onClick={() => handleRowClick(t.id)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>#{t.id}</TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography>{t.title}</Typography>
                          {t.description ? (
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {t.description.length > 90
                                ? t.description.slice(0, 90) + "…"
                                : t.description}
                            </Typography>
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <StatusPill value={t.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityPill value={t.priority} />
                      </TableCell>
                      <TableCell sx={{ minWidth: 240 }}>
                        <AgentLabel agentId={t.agentId ?? null} />
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          aria-label="view"
                          onClick={() => navigate(`/tickets/${t.id}`)}
                        >
                          <EditOutlinedIcon  />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default TicketsPage;
