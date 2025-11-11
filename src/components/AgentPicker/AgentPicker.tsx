import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, TextField } from "@mui/material";
import { qk } from "../../services/api/queryKeys";
import { listAgents } from "../../services/api/agentsApi";
import type { IAgent } from "../../interfaces/agents";


type Props = {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  sx?: object;
  label?: string;
};

const AgentPicker: React.FC<Props> = ({ value, onChange, disabled, sx, label }) => {
  const { data } = useQuery({ queryKey: qk.agents(), queryFn: listAgents });
  const options = data ?? [];
  const selected = options.find(a => a.id === value) ?? null;

  return (
    <Autocomplete
      sx={sx}
      options={options}
      getOptionLabel={(o: IAgent) => o.name}
      value={selected}
      onChange={(_, v) => onChange(v ? v.id : null)}
      disabled={disabled}
      renderInput={(params) => <TextField {...params} label={label ?? "Agent"} size="small" />}
      isOptionEqualToValue={(a, b) => a.id === b.id}
    />
  );
};

export default AgentPicker;
