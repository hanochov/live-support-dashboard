import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTicket, updateTicketStatus, assignTicket } from '../../services/api/ticketsApi';
import { qk } from '../../services/api/queryKeys';
import AgentPicker from '../../components/AgentPicker/AgentPicker';
import type { TicketStatus } from '../../interfaces/tickets';

const STATUS_OPTIONS: TicketStatus[] = ['Open', 'InProgress', 'Resolved'];

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading, isError, error } = useQuery({
    queryKey: qk.ticket(id || ''),
    queryFn: () => getTicket(id || ''),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(id!, { status }),
    onSuccess: (updatedTicket) => {
      queryClient.invalidateQueries({ queryKey: qk.ticket(updatedTicket.id) });
      queryClient.invalidateQueries({ queryKey: qk.tickets() });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (agentId: number | null) => assignTicket(id!, { agentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.ticket(id!) });
      queryClient.invalidateQueries({ queryKey: qk.tickets() });
    },
  });

  const handleStatusChange = (e: SelectChangeEvent<TicketStatus>) => {
    statusMutation.mutate(e.target.value as TicketStatus);
  };

  const handleAgentAssign = (agentId: number | null) => {
    assignMutation.mutate(agentId);
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', m: '40px auto' }} />;
  if (isError) return <Alert severity="error">Error loading ticket: {error?.message}</Alert>;
  if (!ticket) return <Alert severity="warning">Ticket not found or ID is missing.</Alert>;

  const getPriorityColor = (priority: string): ChipProps['color'] => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'secondary';
      case 'Medium': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'Resolved': return 'success';
      case 'InProgress': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Ticket #{ticket.id}: {ticket.title}
        </Typography>
        <Button onClick={() => navigate('/tickets')} variant="outlined">
          Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Actions panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Actions
            </Typography>

            {/* Status (Select, v7) */}
            <FormControl fullWidth disabled={statusMutation.isPending}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select<TicketStatus>
                labelId="status-label"
                label="Status"
                value={ticket.status}
                onChange={handleStatusChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Agent assignment */}
            <AgentPicker
              label="Assign Agent"
              value={ticket.agentId ?? null}
              onChange={handleAgentAssign}
              disabled={assignMutation.isPending}
              sx={{ width: '100%' }}
            />

            {(statusMutation.isPending || assignMutation.isPending) && (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            )}

            {statusMutation.isError && <Alert severity="error">Status update failed.</Alert>}
            {assignMutation.isError && <Alert severity="error">Assignment failed.</Alert>}
          </Paper>
        </Grid>

        {/* Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Chip label={ticket.priority} color={getPriorityColor(ticket.priority)} sx={{ mr: 1 }} />
              <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
            </Box>

            <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
              {ticket.description}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Agent:</strong> {ticket.agentName || 'Unassigned'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TicketDetails;
