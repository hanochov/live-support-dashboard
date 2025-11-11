import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Chip,
    Typography,
    Box
} from '@mui/material';
import type { ITicket, TicketPriority, TicketStatus } from '../../interfaces/tickets';

type Props = {
  tickets: ITicket[];
  onTicketClick: (id: number) => void;
};

const getStatusColor = (status: TicketStatus) => {
    switch (status) {
        case 'Open': return 'primary';
        case 'InProgress': return 'warning';
        case 'Resolved': return 'success';
        default: return 'default';
    }
};

const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
        case 'Critical': return 'error';
        case 'High': return 'secondary';
        case 'Medium': return 'info';
        case 'Low': return 'default';
        default: return 'default';
    }
};

const TicketList: React.FC<Props> = ({ tickets, onTicketClick }) => {
    if (tickets.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No tickets match the current filters.</Typography>
            </Box>
        );
    }
    
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Agent</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow 
              key={ticket.id} 
              hover 
              onClick={() => onTicketClick(ticket.id)} 
              sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <Chip 
                    label={ticket.status} 
                    size="small" 
                    color={getStatusColor(ticket.status) as 'primary' | 'warning' | 'success'} 
                />
              </TableCell>
              <TableCell>
                <Chip 
                    label={ticket.priority} 
                    size="small" 
                    color={getPriorityColor(ticket.priority) as 'error' | 'secondary' | 'info'}
                />
              </TableCell>
              <TableCell>{ticket.agentName ?? 'Unassigned'}</TableCell>
              <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketList;