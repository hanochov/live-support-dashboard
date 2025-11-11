import React, { useMemo } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Toolbar,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { listTickets } from '../../services/api/ticketsApi';
import { qk } from '../../services/api/queryKeys';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectFilters } from '../../store/selectors';
import {
  setStatusFilter,
  setPriorityFilter,
  setSearch,
  openCreate,
} from '../../store/uiSlice';
import StatsCard from '../../components/StatsCard/StatsCard';
import TicketList from '../../components/TicketList/TicketList';
import TicketDrawer from '../../components/TicketDrawer/TicketDrawer';
import type { TicketPriority, TicketStatus } from '../../interfaces/tickets';

const STATUS_OPTIONS: (TicketStatus | 'All')[] = ['All', 'Open', 'InProgress', 'Resolved'];
const PRIORITY_OPTIONS: (TicketPriority | 'All')[] = ['All', 'Low', 'Medium', 'High', 'Critical'];

const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  const { data: tickets, isLoading, isError, error } = useQuery({
    queryKey: qk.tickets(filters),
    queryFn: () =>
      listTickets({
        status: filters.status,
        priority: filters.priority,
        search: filters.search,
      }),
  });

  const stats = useMemo(() => {
    if (!tickets) return { open: 0, inProgress: 0, resolvedToday: 0, critical: 0 };
    const open = tickets.filter((t) => t.status === 'Open').length;
    const inProgress = tickets.filter((t) => t.status === 'InProgress').length;
    const critical = tickets.filter((t) => t.priority === 'Critical').length;
    const resolvedToday = 5;
    return { open, inProgress, resolvedToday, critical };
  }, [tickets]);

  const handleTicketClick = (ticketId: number) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', m: '40px auto' }} />;
  if (isError) return <Alert severity="error">Error loading tickets: {error?.message}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Live Support Dashboard
      </Typography>

      {/* Stats Cards Section (Responsive) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Open Tickets" value={stats.open} color="info.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="In Progress" value={stats.inProgress} color="warning.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Critical Tickets" value={stats.critical} color="error.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Resolved Today" value={stats.resolvedToday} color="success.main" />
        </Grid>
      </Grid>

      {/* Filtering and Actions Toolbar */}
      <Toolbar
        component={Box}
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 1,
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <TextField
          label="Search Ticket"
          size="small"
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          sx={{ minWidth: 200, flexGrow: 1 }}
        />

        <TextField
          select
          label="Status"
          size="small"
          value={filters.status}
          onChange={(e) =>
            dispatch(setStatusFilter(e.target.value as TicketStatus | 'All'))
          }
          sx={{ minWidth: 120 }}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Priority"
          size="small"
          value={filters.priority}
          onChange={(e) =>
            dispatch(setPriorityFilter(e.target.value as TicketPriority | 'All'))
          }
          sx={{ minWidth: 120 }}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => dispatch(openCreate())}
          sx={{ ml: 'auto' }}
        >
          Create New Ticket
        </Button>
      </Toolbar>

      {/* Ticket List Section */}
      <Box sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2, boxShadow: 1 }}>
        <TicketList tickets={tickets ?? []} onTicketClick={handleTicketClick} />
        {tickets?.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            No tickets match the current filters.
          </Typography>
        )}
      </Box>

      {/* Ticket Creation Drawer */}
      <TicketDrawer />
    </Container>
  );
};

export default TicketsPage;
