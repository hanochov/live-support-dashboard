import React from 'react';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '../../store';
import { closeCreate } from '../../store/uiSlice';
import TicketForm from '../TicketForm/TicketForm';

const TicketDrawer: React.FC = () => {
    const dispatch = useAppDispatch();
    const isCreateOpen = useAppSelector(s => s.ui.modals.createOpen);

    const handleClose = () => {
        dispatch(closeCreate());
    };

    return (
        <Drawer
            anchor="right"
            open={isCreateOpen}
            onClose={handleClose}
            slotProps={{ 
                paper: { 
                    sx: { 
                        width: { xs: '100%', sm: 450, md: 550 } 
                    } 
                } 
            }}
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2">
                        Create New Ticket
                    </Typography>
                    <IconButton onClick={handleClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <TicketForm onClose={handleClose} /> 
            </Box>
        </Drawer>
    );
};

export default TicketDrawer;