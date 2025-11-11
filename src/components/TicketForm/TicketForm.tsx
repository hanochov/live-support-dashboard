import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    MenuItem, 
    CircularProgress, 
    Alert 
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTicket } from '../../services/api/ticketsApi';
import { qk } from '../../services/api/queryKeys';
import type { ICreateTicketRequest, TicketPriority } from '../../interfaces/tickets';

const PRIORITY_OPTIONS: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

type Props = {
    onClose: () => void;
};

const TicketForm: React.FC<Props> = ({ onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<ICreateTicketRequest>({
        title: '',
        description: '',
        priority: 'Low',
    });
    const [validationError, setValidationError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: createTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qk.tickets() }); 
            onClose();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!formData.title.trim() || !formData.description.trim()) {
            setValidationError('Title and Description are required.');
            return;
        }

        mutation.mutate(formData);
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            {validationError && <Alert severity="error">{validationError}</Alert>}
            {mutation.isError && <Alert severity="error">Error creating ticket: {mutation.error.message}</Alert>}

            <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
            />
            <TextField
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                fullWidth
                required
            >
                {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={onClose} variant="outlined" disabled={mutation.isPending}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={mutation.isPending}
                    startIcon={mutation.isPending && <CircularProgress size={20} color="inherit" />}
                >
                    {mutation.isPending ? 'Creating...' : 'Create Ticket'}
                </Button>
            </Box>
        </Box>
    );
};

export default TicketForm;