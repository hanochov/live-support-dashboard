import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Box,
    type SxProps,

} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import { listAgents } from '../../services/api/agentsApi';
import { qk } from '../../services/api/queryKeys';
import type { Theme } from '@emotion/react';

interface AgentPickerProps {
    label: string;
    value: number | null;
    onChange: (agentId: number | null) => void;
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

const AgentPicker: React.FC<AgentPickerProps> = ({ 
    label, 
    value, 
    onChange, 
    disabled = false, 
    sx 
}) => {
    const { 
        data: agents, 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: qk.agents(),
        queryFn: listAgents,
    });

    const handleChange = (event: SelectChangeEvent<number | string>) => {
        const selectedValue = event.target.value;
        const agentId = (selectedValue === 0 || selectedValue === 'null') 
            ? null 
            : (selectedValue as number);
        
        onChange(agentId);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', height: 56, ...sx }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <InputLabel>{label}</InputLabel>
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={sx}>
                Error loading agents: {error?.message}
            </Alert>
        );
    }

    const selectValue = value === null ? 0 : value;

    return (
        <FormControl fullWidth disabled={disabled} sx={sx}>
            <InputLabel id="agent-picker-label">{label}</InputLabel>
            <Select<number | string>
                labelId="agent-picker-label"
                label={label}
                value={selectValue}
                onChange={handleChange}
                displayEmpty
            >
                <MenuItem value={0}>
                    <em>Unassigned</em>
                </MenuItem>
                
                {agents?.filter(a => a.isActive).map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                        {agent.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default AgentPicker;